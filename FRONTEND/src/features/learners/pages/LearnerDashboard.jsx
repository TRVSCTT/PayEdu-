import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../store/authStore';
import { Link } from 'react-router-dom';

export function LearnerDashboard() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title="Espace Apprenant">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Bienvenue dans votre espace</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 mb-6">
          Initiez et suivez vos paiements universitaires.
        </p>
        
        <Link
          to="/apprenant/paiements/nouveau"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT"
        >
          Initier un paiement
        </Link>
      </div>
    </DashboardLayout>
  );
}
