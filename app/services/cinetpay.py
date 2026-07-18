"""
Client CinetPay — API Checkout v2.

Documentation officielle : https://docs.cinetpay.com/api/1.0-fr/checkout/initialisation

Deux endpoints utilisés :
- POST https://api-checkout.cinetpay.com/v2/payment        → initialiser un paiement
- POST https://api-checkout.cinetpay.com/v2/payment/check   → vérifier le vrai statut d'une transaction

Point de sécurité important documenté par CinetPay lui-même : le contenu du
webhook (notify_url) ne doit JAMAIS être considéré comme la vérité. CinetPay
recommande explicitement de rappeler l'API `/payment/check` avec le
`transaction_id` reçu, pour éviter les attaques de type man-in-the-middle sur
la notification. C'est ce que fait `traiter_webhook_cinetpay` dans
`payment_service.py`.
"""

import abc
import asyncio
import random

import httpx

from app.core.config import settings

class CinetPayError(Exception):
    """Levée quand CinetPay refuse la requête ou que l'appel réseau échoue."""


class CinetPayClientBase(abc.ABC):
    @abc.abstractmethod
    def initier_paiement(
        self, transaction_id: str, montant: float, description: str,
        numero_client: str, nom_client: str, prenom_client: str,
        moyen_paiement: str = "orange_money",
        email_client: str| None=None,
        adresse_client:str| None=None,
        ville_client:str | None=None,
        code_postal_client: str| None=None,
    ) -> dict:
        """Retourne {'payment_url': ..., 'payment_token': ...}."""

    @abc.abstractmethod
    def verifier_transaction(self, transaction_id: str) -> dict:
        """Retourne {'statut': 'ACCEPTED' | 'REFUSED' | 'PENDING', 'moyen_paiement': str | None}."""


class CinetPayClient(CinetPayClientBase):
    BASE_URL = "https://api-checkout.cinetpay.com/v2"

    def initier_paiement(
        self, transaction_id: str, montant: float, description: str,
        numero_client: str, nom_client: str, prenom_client: str,
        moyen_paiement: str = "orange_money",
        email_client: str| None=None,
        adresse_client:str| None=None,
        ville_client:str | None=None,
        code_postal_client: str| None=None,

    ) -> dict:
        channels = "CREDIT_CARD" if moyen_paiement == "carte_bancaire" else "MOBILE_MONEY"
        payload = {
            "apikey": settings.CINETPAY_APIKEY,
            "site_id": settings.CINETPAY_SITE_ID,
            "transaction_id": transaction_id,
            "amount": int(montant),
            "currency": "XAF",
            "description": description,
            "customer_name": nom_client,
            "customer_surname": prenom_client,
            "customer_phone_number": numero_client,
            "customer_country": "CM",
            "notify_url": settings.CINETPAY_NOTIFY_URL,
            "return_url": settings.CINETPAY_RETURN_URL,
            "channels": channels,
            "lang": "FR",
        }
        if channels == "CREDIT_CARD":
            payload.update({
                "customer_email":  email_client or f"{numero_client}@payedu.cm",
                "customer_address" : adresse_client or "Douala",
                "customer_city": ville_client or "Douala",
                "customer_zipcode":code_postal_client or "00000",
                "customer_state": "CM",
            })
        with httpx.AsyncClient(timeout=20) as client:
            try:
                resp =  client.post(f"{self.BASE_URL}/payment", json=payload)
                resp.raise_for_status()
                data = resp.json()
            except httpx.HTTPError as exc:
                raise CinetPayError(f"Échec d'appel à CinetPay : {exc}") from exc

        if data.get("code") != "201":
            raise CinetPayError(f"CinetPay a refusé l'initialisation : {data.get('message')}")

        return {
            "payment_url": data["data"]["payment_url"],
            "payment_token": data["data"]["payment_token"],
        }

    def verifier_transaction(self, transaction_id: str) -> dict:
        payload = {
            "apikey": settings.CINETPAY_APIKEY,
            "site_id": settings.CINETPAY_SITE_ID,
            "transaction_id": transaction_id,
        }
        with httpx.AsyncClient(timeout=20) as client:
            try:
                resp = client.post(f"{self.BASE_URL}/payment/check", json=payload)
                resp.raise_for_status()
                data = resp.json()
            except httpx.HTTPError as exc:
                raise CinetPayError(f"Échec de vérification CinetPay : {exc}") from exc

        statut_cinetpay = data.get("data", {}).get("status", "PENDING")
        return {
            "statut": statut_cinetpay,  # "ACCEPTED", "REFUSED", "WAITING_FOR_CUSTOMER", ...
            "moyen_paiement": data.get("data", {}).get("payment_method"),
            "reference_operateur": data.get("data", {}).get("operator_id"),
        }


class MockCinetPayClient(CinetPayClientBase):
    """Simule CinetPay pour développer et présenter le projet sans compte marchand actif.

    - `initier_paiement` renvoie une fausse URL de checkout que ton frontend
      peut afficher/ouvrir pour la démo.
    - `verifier_transaction` réussit dans ~85% des cas après un court délai,
      pour pouvoir montrer les deux chemins (succès et échec) en soutenance.
    """

    _statuts_simules: dict[str, str] = {}

    def initier_paiement(
        self, transaction_id: str, montant: float, description: str,
        numero_client: str, nom_client: str, prenom_client: str,
        moyen_paiement: str = "orange_money",
        email_client: str| None=None,
        adresse_client:str| None=None,
        ville_client:str | None=None,
        code_postal_client: str| None=None,
    ) -> dict:
        asyncio.sleep(0.5)
        statut = "ACCEPTED" if random.random() < 0.85 else "REFUSED"
        self._statuts_simules[transaction_id] = statut
        return {
            "payment_url": f"https://checkout.cinetpay.com/payment/mock-{transaction_id}",
            "payment_token": f"mock-token-{transaction_id}",
        }

    def verifier_transaction(self, transaction_id: str) -> dict:
        asyncio.sleep(0.5)
        statut = self._statuts_simules.get(transaction_id, "REFUSED")
        return {
            "statut": statut,
            "moyen_paiement": "OM" if statut == "ACCEPTED" else None,
            "reference_operateur": f"MOCK-OP-{transaction_id}" if statut == "ACCEPTED" else None,
        }


def get_cinetpay_client() -> CinetPayClientBase:
    if settings.USE_MOCK_CINETPAY:
        return MockCinetPayClient()
    return CinetPayClient()