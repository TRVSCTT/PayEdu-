import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../store/authStore';
import { Link } from 'react-router-dom';

export function EstablishmentDashboard() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title="Espace Établissement">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Bienvenue, Gestionnaire</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 mb-6">
          Gérez vos apprenants et le suivi des paiements.
        </p>
        
        <Link
          to="/etablissement/apprenants/nouveau"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-DEFAULT hover:bg-primary-dark"
        >
          Créer un apprenant
        </Link>
      </div>
    </DashboardLayout>
  );
}
