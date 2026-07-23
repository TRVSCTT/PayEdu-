import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Fonction pour générer et télécharger un PDF à partir d'un élément HTML
 * @param {HTMLElement} element - L'élément HTML à convertir (ex: une référence ref.current)
 * @param {string} filename - Le nom du fichier à télécharger
 */
export async function generatePDF(element, filename = 'document.pdf') {
  if (!element) return;

  try {
    // On convertit l'élément HTML en canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Pour une meilleure qualité d'image
      useCORS: true, // Pour gérer les images externes (si l'API UI-Avatars est utilisée)
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    // On calcule les dimensions pour un PDF A4
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Ajout de l'image au PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Téléchargement automatique
    pdf.save(filename);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF :', error);
    throw error;
  }
}
