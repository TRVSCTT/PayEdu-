"""
Génère les 4 QR codes remis à l'apprenant une fois le paiement confirmé par
l'opérateur, à présenter à la caisse pour validation finale.
"""

import base64
import io
import json

import qrcode

from app.models.payment import Paiement, TypeQRCode


def generer_contenus_qrcodes(paiement: Paiement) -> dict[TypeQRCode, str]:
    return {
        TypeQRCode.INFOS_APPRENANT: json.dumps({
            "matricule": paiement.infos_confirmees.get("matricule"),
            "nom": paiement.infos_confirmees.get("nom"),
        }),
        TypeQRCode.COMPTE_PAIEMENT: json.dumps({
            "moyen": paiement.moyen_paiement.value,
            "numero": paiement.numero_compte_paiement,
        }),
        TypeQRCode.MONTANT: json.dumps({
            "montant": str(paiement.montant),
        }),
        TypeQRCode.IDENTIFIANT_TRANSACTION: json.dumps({
            "paiement_id": str(paiement.id),
            "reference": paiement.reference_transaction,
        }),
    }


def encoder_qrcode_base64(contenu: str) -> str:
    """Convertit un contenu texte en image QR code encodée en base64 (PNG)."""
    image = qrcode.make(contenu)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()