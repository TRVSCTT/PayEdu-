import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { paymentService } from '../../../services/paymentService';

export function VerificationRequestPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const histData = await paymentService.obtenirHistorique();
        // Filter to only show transactions that are not fully validated yet, or show all.
        // For control requests, usually it's pending or failed transactions.
        setTransactions(histData || []);
      } catch (error) {
        console.error("Erreur récupération transactions", error);
      }
    };
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTx || !description) return;
    
    setIsSubmitting(true);
    // Simulate API call for now
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] font-sans text-gray-900 pb-24">
      
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full border border-gray-900 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors mr-3"
        >
          <ChevronLeft className="w-6 h-6 text-black" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-medium">Demande de contrôle</h1>
      </div>

      <div className="px-5 mt-6 max-w-lg mx-auto">
        
        {/* Info Box */}
        <div className="border border-gray-300 rounded-xl p-4 mb-6 bg-white">
          <p className="text-[14px] text-gray-500 leading-relaxed">
            Si vous n'avez pas reçu de confirmation après le délai défini, vous pouvez demander un contrôle de votre paiement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Transaction Dropdown */}
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-2">
              Choix De La Transaction
            </label>
            <div className="relative">
              <select 
                value={selectedTx}
                onChange={(e) => setSelectedTx(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-900 rounded-xl px-4 py-3.5 text-[15px] focus:outline-none focus:ring-1 focus:ring-black"
                required
              >
                <option value="" disabled>Sélectionnez une transaction...</option>
                {transactions.map(tx => (
                  <option key={tx.id} value={tx.id}>
                    {new Date(tx.created_at).toLocaleDateString('fr-FR')} - {tx.montant ? tx.montant.toLocaleString('fr-FR') : '0'} FCFA ({tx.objet_paiement})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-black" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-[13px] font-medium text-gray-900 mb-2">
              Description du problème
            </label>
            <div className="relative border border-gray-900 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-black">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={600}
                rows={8}
                className="w-full px-4 py-3 text-[15px] focus:outline-none resize-none bg-white"
                required
              ></textarea>
              <div className="absolute bottom-3 right-4 text-[11px] text-gray-400">
                {description.length}/600 de caractères max
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={!selectedTx || !description || isSubmitting}
            className="w-full mt-4 py-4 rounded-xl bg-black text-white text-[17px] font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
          
        </form>

      </div>
    </div>
  );
}
