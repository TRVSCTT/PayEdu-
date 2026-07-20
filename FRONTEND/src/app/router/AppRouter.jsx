import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RoleRoute } from './RoleRoute';
import { USER_ROLES } from '../../constants/roles';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterAdminPage } from '../../features/auth/pages/RegisterAdminPage';
import { AdminDashboard } from '../../features/auth/pages/AdminDashboard';
import { RegisterEstablishmentPage } from '../../features/establishments/pages/RegisterEstablishmentPage';
import { EstablishmentDashboard } from '../../features/establishments/pages/EstablishmentDashboard';
import { RegisterLearnerPage } from '../../features/learners/pages/RegisterLearnerPage';
import { LearnerDashboard } from '../../features/learners/pages/LearnerDashboard';
import { CreatePaymentPage } from '../../features/payments/pages/CreatePaymentPage';
import { PaymentDraftPage } from '../../features/payments/pages/PaymentDraftPage';

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
                  <Route path="/" element={<LearnerDashboard />} />
                  <Route path="/paiements/nouveau" element={<CreatePaymentPage />} />
                  <Route path="/paiements/brouillon/:paymentId" element={<PaymentDraftPage />} />
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
