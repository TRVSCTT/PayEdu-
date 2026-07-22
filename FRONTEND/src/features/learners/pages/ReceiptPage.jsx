import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, CreditCard, QrCode } from 'lucide-react';

export function ReceiptPage() {
  const navigate = useNavigate();

  const receiptData = {
    nom: "Dominiek Joël",
    matricule: "IUT202600123",
    filiere: "Génie logiciel - licence",
    montant: "350 000FCFA",
    objectif: "Tranche 2",
    transaction: "PAY-2026-3651",
    dateRdv: "29 juin 2026 à 10:00",
    lieu: "UBA Douala, Ange Raphaël",
    dateEmission: "10 juillet 2026"
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 font-sans flex flex-col items-center">
      
      {/* Back button for navigation */}
      <div className="w-full max-w-3xl mb-4 flex justify-start print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Printable Receipt Container */}
      <div className="bg-white w-full max-w-3xl shadow-lg border border-gray-200 p-8 sm:p-12 relative print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          {/* Mock Logo */}
          <div className="relative mr-4 flex-shrink-0">
            <GraduationCap className="w-12 h-12 text-black" strokeWidth={1.5} />
            <CreditCard className="w-6 h-6 text-black absolute bottom-0 -left-1 bg-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-wide uppercase">ETUTRANSFERT - IUTD</h1>
            <p className="text-[11px] text-gray-600">Transaction de n'importe où à tout moment</p>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-[2px] bg-gray-900 mb-8"></div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-xl font-medium text-gray-900 mb-1">Reçu de paiement</h2>
          <p className="text-xs text-gray-500">Document officiel - Validation des frais de paiement</p>
        </div>

        {/* Details Table */}
        <div className="space-y-0 mb-16">
          <DetailRow label="Nom & prénom" value={receiptData.nom} />
          <DetailRow label="Matricule" value={receiptData.matricule} />
          <DetailRow label="Filière" value={receiptData.filiere} />
          <DetailRow label="Montant payé" value={receiptData.montant} />
          <DetailRow label="Objectif" value={receiptData.objectif} />
          <DetailRow label="N° de transaction" value={receiptData.transaction} />
          <DetailRow label="Date et heure du rendez-vous" value={receiptData.dateRdv} />
          <DetailRow label="Lieu" value={receiptData.lieu} />
          <DetailRow label="Date d'émission" value={receiptData.dateEmission} />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end mt-12">
          
          {/* Left: Signature */}
          <div className="w-1/3">
            <div className="text-lg font-medium text-gray-800 border-b border-gray-400 inline-block pb-1 mb-1">
              Nom_du_caissier
            </div>
            <p className="text-sm text-gray-500">Signature et cachet</p>
          </div>

          {/* Center: QR Code */}
          <div className="w-1/3 flex flex-col items-center">
            <QrCode className="w-24 h-24 text-black mb-2" strokeWidth={1.5} />
            <p className="text-[10px] text-gray-600 tracking-wider">PAY - 202663651</p>
          </div>

          {/* Right: Stamp */}
          <div className="w-1/3 flex justify-end">
            <div className="w-24 h-24 rounded-full border border-gray-400 flex flex-col items-center justify-center opacity-70 rotate-[-15deg]">
               <GraduationCap className="w-8 h-8 text-gray-600 mb-1" strokeWidth={1} />
               <p className="text-[6px] text-center text-gray-500 uppercase leading-tight w-16">
                 Cachet IUTD<br/>paiement valide
               </p>
            </div>
          </div>

        </div>

      </div>

      {/* Print Button */}
      <button 
        onClick={() => window.print()}
        className="mt-8 bg-black text-white px-8 py-3 rounded-xl font-medium shadow-md hover:bg-gray-800 transition-colors print:hidden"
      >
        Imprimer le reçu
      </button>

    </div>
  );
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 border-b border-gray-300">
    <span className="text-[15px] text-gray-800">{label}</span>
    <span className="text-[15px] text-gray-900 font-medium text-right">{value}</span>
  </div>
);
