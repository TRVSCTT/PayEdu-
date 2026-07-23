import { AuthProvider } from '../../store/authStore';
import { QueryProvider } from './QueryProvider';
import { PaymentProvider } from '../../features/payments/context/PaymentContext';
import { Toaster } from 'sonner';
import { ThemeProvider } from '../../store/themeStore';

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <PaymentProvider>
            {children}
            <Toaster position="top-right" richColors />
          </PaymentProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
