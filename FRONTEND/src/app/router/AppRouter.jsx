import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { LearnerLayout } from '../../components/layout/LearnerLayout'
import { USER_ROLES } from '../../constants/roles'
import { HomePage } from '../../features/public/pages/HomePage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { RoleRoute } from './RoleRoute'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterAdminPage } from '../../features/auth/pages/RegisterAdminPage'
import { AdminDashboard } from '../../features/auth/pages/AdminDashboard'
import { RegisterEstablishmentPage } from '../../features/establishments/pages/RegisterEstablishmentPage'
import { EstablishmentDashboard } from '../../features/establishments/pages/EstablishmentDashboard'
import { RegisterCaissePage } from '../../features/establishments/pages/RegisterCaissePage'
import { CaisseDashboard } from '../../features/caisse/pages/CaisseDashboard'
import { RegisterLearnerPage } from '../../features/learners/pages/RegisterLearnerPage'
import { LearnerDashboard } from '../../features/learners/pages/LearnerDashboard'
import { CreatePaymentPage } from '../../features/payments/pages/CreatePaymentPage'
import { UploadReceiptPage } from '../../features/payments/pages/UploadReceiptPage'
import { SelectPaymentMethodPage } from '../../features/payments/pages/SelectPaymentMethodPage'
import { PaymentOptionsPage } from '../../features/payments/pages/PaymentOptionsPage'
import { PaymentSummaryPage } from '../../features/payments/pages/PaymentSummaryPage'
import { PaymentSuccessPage } from '../../features/payments/pages/PaymentSuccessPage'
import { PaymentPendingPage } from '../../features/payments/pages/PaymentPendingPage'
import { AppointmentScheduledPage } from '../../features/payments/pages/AppointmentScheduledPage'
import { PaymentDraftPage } from '../../features/payments/pages/PaymentDraftPage'
import { PaymentSecurityPage } from '../../features/payments/pages/PaymentSecurityPage'
import { NotificationsPage } from '../../features/learners/pages/NotificationsPage'
import { WalletPage } from '../../features/learners/pages/WalletPage'
import { AddPaymentMethodPage } from '../../features/learners/pages/AddPaymentMethodPage'
import { HistoryPage } from '../../features/learners/pages/HistoryPage'
import { AppointmentsPage } from '../../features/learners/pages/AppointmentsPage'
import { ReceiptPage } from '../../features/learners/pages/ReceiptPage'
import { DocumentsPage } from '../../features/learners/pages/DocumentsPage'
import { SettingsPage } from '../../features/learners/pages/SettingsPage'
import { SupportPage } from '../../features/learners/pages/SupportPage'
import { AboutPage } from '../../features/learners/pages/AboutPage'
import { ChatAssistantPage } from '../../features/learners/pages/ChatAssistantPage'
import { VerificationRequestPage } from '../../features/learners/pages/VerificationRequestPage'
import { ProfilePage } from '../../features/learners/pages/ProfilePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

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
          <Route
            path="/inscription"
            element={
              <PublicRoute>
                <RegisterLearnerPage />
              </PublicRoute>
            }
          />
        </Route>

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

        <Route
          path="/etablissement/*"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ESTABLISHMENT_MANAGER]}>
                <Routes>
                  <Route path="/" element={<EstablishmentDashboard />} />
                  <Route path="/caisses/nouveau" element={<RegisterCaissePage />} />
                  <Route path="/apprenants/nouveau" element={<RegisterLearnerPage />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

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
                    <Route path="/portefeuille" element={<WalletPage />} />
                    <Route path="/portefeuille/nouveau" element={<AddPaymentMethodPage />} />
                    <Route path="/histoire" element={<HistoryPage />} />
                    <Route path="/rdv" element={<AppointmentsPage />} />
                    <Route path="/recu" element={<ReceiptPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/parametres" element={<SettingsPage />} />
                    <Route path="/parametres/support" element={<SupportPage />} />
                    <Route path="/parametres/assistant" element={<ChatAssistantPage />} />
                    <Route path="/parametres/controle" element={<VerificationRequestPage />} />
                    <Route path="/parametres/apropos" element={<AboutPage />} />
                    <Route path="/profil" element={<ProfilePage />} />
                  </Route>
                  <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/caisse/*"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={[USER_ROLES.CASHIER]}>
                <Routes>
                  <Route path="/" element={<CaisseDashboard />} />
                </Routes>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
