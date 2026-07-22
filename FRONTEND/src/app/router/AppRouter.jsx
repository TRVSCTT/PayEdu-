import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RoleRoute } from './RoleRoute';
import { USER_ROLES } from '../../constants/roles';

import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LearnerLayout } from '../../components/layout/LearnerLayout';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterAdminPage } from '../../features/auth/pages/RegisterAdminPage';
import { AdminDashboard } from '../../features/auth/pages/AdminDashboard';
import { RegisterEstablishmentPage } from '../../features/establishments/pages/RegisterEstablishmentPage';
import { EstablishmentDashboard } from '../../features/establishments/pages/EstablishmentDashboard';
import { RegisterLearnerPage } from '../../features/learners/pages/RegisterLearnerPage';
import { LearnerDashboard } from '../../features/learners/pages/LearnerDashboard';
import { CreatePaymentPage } from '../../features/payments/pages/CreatePaymentPage';
import { UploadReceiptPage } from '../../features/payments/pages/UploadReceiptPage';
import { SelectPaymentMethodPage } from '../../features/payments/pages/SelectPaymentMethodPage';
import { PaymentOptionsPage } from '../../features/payments/pages/PaymentOptionsPage';
import { PaymentSummaryPage } from '../../features/payments/pages/PaymentSummaryPage';
import { PaymentSuccessPage } from '../../features/payments/pages/PaymentSuccessPage';
import { PaymentPendingPage } from '../../features/payments/pages/PaymentPendingPage';
import { AppointmentScheduledPage } from '../../features/payments/pages/AppointmentScheduledPage';
import { PaymentDraftPage } from '../../features/payments/pages/PaymentDraftPage';
import { PaymentSecurityPage } from '../../features/payments/pages/PaymentSecurityPage';
import { NotificationsPage } from '../../features/learners/pages/NotificationsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Navigate to="/connexion" replace />} />
        
        <Route element={<AuthLayout />}>
          <Route 
            path="/connexion" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/inscription-admin" 
            element={
              <PublicRoute>
                <RegisterAdminPage />
              </PublicRoute>
            } 
          />
        </Route>

        <Route 
          path="/inscription" 
          element={
            <PublicRoute>
              <RegisterLearnerPage />
            </PublicRoute>
          } 
        />

        {/* Routes Administrateur */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/etablissements/nouveau" element={<RegisterEstablishmentPage />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          } 
        />

        {/* Routes Etablissement */}
        <Route 
          path="/etablissement/*" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ESTABLISHMENT_MANAGER]}>
                <Routes>
                  <Route path="/" element={<EstablishmentDashboard />} />
                  <Route path="/apprenants/nouveau" element={<RegisterLearnerPage />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          } 
        />

        {/* Routes Apprenant */}
        <Route 
          path="/apprenant/*" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[USER_ROLES.LEARNER]}>
                <Routes>
                  <Route element={<LearnerLayout />}>
                    <Route path="/" element={<LearnerDashboard />} />
                    <Route path="/paiements" element={<PaymentSecurityPage />} />
                    <Route path="/paiements/nouveau" element={<CreatePaymentPage />} />
                    <Route path="/paiements/quitus" element={<UploadReceiptPage />} />
                    <Route path="/paiements/methode" element={<SelectPaymentMethodPage />} />
                    <Route path="/paiements/options" element={<PaymentOptionsPage />} />
                    <Route path="/paiements/recapitulatif" element={<PaymentSummaryPage />} />
                    <Route path="/paiements/succes" element={<PaymentSuccessPage />} />
                    <Route path="/paiements/attente" element={<PaymentPendingPage />} />
                    <Route path="/paiements/rendez-vous" element={<AppointmentScheduledPage />} />
                    <Route path="/paiements/brouillon/:paymentId" element={<PaymentDraftPage />} />
                  </Route>
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          } 
        />

        {/* Route Caisse */}
        <Route 
          path="/caisse/*" 
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[USER_ROLES.CASHIER]}>
                <div className="p-8 font-bold">Caisse Dashboard (à faire)</div>
              </RoleRoute>
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
