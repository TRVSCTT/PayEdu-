import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../store/authStore';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title="Tableau de bord Administrateur">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Bienvenue, Administrateur</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 mb-6">
          Gérez les établissements et les configurations globales.
        </p>

        <Link
          to="/admin/etablissements/nouveau"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-DEFAULT hover:bg-primary-dark"
        >
          Créer un établissement
        </Link>
      </div>
    </DashboardLayout>
  );
}
