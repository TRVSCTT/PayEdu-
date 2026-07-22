import io
import json
from datetime import datetime
from decimal import Decimal

import qrcode
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


def generer_recu_pdf(
    paiement_id: str,
    numero_recu:str,
    reference_transaction: str,
    etablissement_nom: str,
    etablissement_sigle: str,
    apprenant_nom: str,
    apprenant_matricule: str,
    apprenant_filiere: str,
    apprenant_niveau: str,
    objet_libelle: str,
    montant: Decimal,
    moyen_paiement: str,
    acquitte_le: datetime,
) -> bytes:
    buffer = io.BytesIO()
    largeur, hauteur = A5
    c = canvas.Canvas(buffer, pagesize=A5)

    marge = 15 * mm
    y = hauteur - marge

    # --- En-tête : logo, nom de l'application + établissement, slogan ---
    taille_logo = 14 * mm
    c.setStrokeColorRGB(0.3, 0.3, 0.3)
    c.rect(marge, y - taille_logo, taille_logo, taille_logo)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(marge + taille_logo / 2, y - taille_logo / 2 - 3, etablissement_sigle[:4].upper())

    c.setFont("Helvetica-Bold", 13)
    c.drawString(marge + taille_logo + 4 * mm, y - 5 * mm, f"ETUTRANSFERT — {etablissement_sigle}")
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    c.drawString(marge + taille_logo + 4 * mm, y - 10 * mm, "Transaction de n'importe où à tout moment")
    c.setFillColorRGB(0, 0, 0)

    y -= taille_logo + 6 * mm
    c.setStrokeColorRGB(0.7, 0.7, 0.7)
    c.line(marge, y, largeur - marge, y)
    y -= 8 * mm

    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(largeur / 2, y, "REÇU DE PAIEMENT")
    y -= 10 * mm

    # --- Bloc Bénéficiaire ---
    c.setFont("Helvetica-Bold", 10)
    c.drawString(marge, y, "BÉNÉFICIAIRE")
    y -= 6 * mm
    c.setFont("Helvetica", 9)
    c.drawString(marge, y, "Nom & prénom")
    c.drawRightString(largeur - marge, y, apprenant_nom)
    y -= 5.5 * mm
    c.drawString(marge, y, "Matricule")
    c.drawRightString(largeur - marge, y, apprenant_matricule)
    y -= 5.5 * mm
    c.drawString(marge, y, "Filière")
    filiere_affichee = f"{apprenant_filiere} - {apprenant_niveau}" if apprenant_niveau else apprenant_filiere
    c.drawRightString(largeur - marge, y, filiere_affichee)
    y -= 9 * mm

    c.setStrokeColorRGB(0.85, 0.85, 0.85)
    c.line(marge, y, largeur - marge, y)
    y -= 8 * mm

    # --- Bloc Paiement ---
    c.setFont("Helvetica-Bold", 10)
    c.drawString(marge, y, "PAIEMENT")
    y -= 6 * mm
    c.setFont("Helvetica", 9)
    c.drawString(marge, y, "Objectif")
    c.drawRightString(largeur - marge, y, objet_libelle)
    y -= 5.5 * mm
    c.drawString(marge, y, "N° de transaction")
    c.drawRightString(largeur - marge, y, numero_recu)
    y -= 5.5 * mm
    c.drawString(marge, y, "Moyen de paiement")
    c.drawRightString(largeur - marge, y, moyen_paiement.replace("_", " ").title())
    y -= 5.5 * mm
    c.drawString(marge, y, "Date / heure")
    c.drawRightString(largeur - marge, y, acquitte_le.strftime("%d/%m/%Y à %H:%M"))
    y -= 9 * mm

    c.setFont("Helvetica-Bold", 13)
    c.drawString(marge, y, "Montant payé")
    c.drawRightString(largeur - marge, y, f"{montant:,.0f} FCFA".replace(",", " "))

    # --- Zone inférieure fixe : QR code (gauche) + cachet/signature banque (droite) ---
    zone_bas_y = 22 * mm  # ancrée en bas de page, indépendamment du contenu au-dessus

    contenu_qr = json.dumps({"paiement_id": paiement_id, "reference": reference_transaction})
    qr_image = qrcode.make(contenu_qr)
    qr_buffer = io.BytesIO()
    qr_image.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)
    taille_qr = 24 * mm
    c.drawImage(ImageReader(qr_buffer), marge, zone_bas_y, width=taille_qr, height=taille_qr)
    c.setFont("Helvetica", 6.5)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    c.drawString(marge, zone_bas_y - 4 * mm, "Scanner pour vérifier l'authenticité")
    c.setFillColorRGB(0, 0, 0)

    largeur_zone_cachet = 55 * mm
    zone_x = largeur - marge - largeur_zone_cachet
    c.setStrokeColorRGB(0.6, 0.6, 0.6)
    c.setDash(2, 2)
    c.rect(zone_x, zone_bas_y, largeur_zone_cachet, taille_qr)
    c.setDash()
    c.setFont("Helvetica-Oblique", 7)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawCentredString(zone_x + largeur_zone_cachet / 2, zone_bas_y + taille_qr / 2, "Cachet et signature de la banque")
    c.setFillColorRGB(0, 0, 0)

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.getvalue()