import { AuthProvider } from '../../store/authStore';
import { QueryProvider } from './QueryProvider';
import { Toaster } from 'sonner';

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryProvider>
  );
}
