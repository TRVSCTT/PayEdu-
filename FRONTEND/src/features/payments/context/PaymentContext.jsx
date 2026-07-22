import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const [paymentData, setPaymentData] = useState({
    objet_paiement: '',
    montant_total: 0,
    moyen_paiement: '', // 'orange_money', 'mtn_momo', 'carte_bancaire'
    numero_compte_paiement: '',
    paiement_id: null,
  });

  const updatePaymentData = (newData) => {
    setPaymentData((prev) => ({ ...prev, ...newData }));
  };

  const resetPaymentData = () => {
    setPaymentData({
      objet_paiement: '',
      montant_total: 0,
      moyen_paiement: '',
      numero_compte_paiement: '',
      paiement_id: null,
    });
  };

  return (
    <PaymentContext.Provider value={{ paymentData, updatePaymentData, resetPaymentData }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
}
