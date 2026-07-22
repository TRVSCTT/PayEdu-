import { AuthProvider } from '../../store/authStore';
import { QueryProvider } from './QueryProvider';
import { PaymentProvider } from '../../features/payments/context/PaymentContext';
import { Toaster } from 'sonner';

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <PaymentProvider>
          {children}
          <Toaster position="top-right" richColors />
        </PaymentProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
