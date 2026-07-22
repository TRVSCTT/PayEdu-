import { useState, useEffect } from 'react';
import { LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../../store/authStore';
import { paymentService } from '../../../services/paymentService';

export function ProfilePage() {
  const { user, removeAuthenticationData } = useAuth();
  const [profil, setProfil] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const data = await paymentService.obtenirProfil();
        setProfil(data);
        setFormData({
          email: data.email || '',
          telephone: data.telephone || '',
          filiere: data.filiere || '',
          niveau: data.niveau || ''
        });
      } catch (error) {
        console.error("Erreur de récupération du profil", error);
      }
    };
    fetchProfil();
  }, []);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      try {
        setIsSaving(true);
        const updated = await paymentService.modifierProfil(formData);
        setProfil(updated);
        setIsEditing(false);
      } catch (error) {
        console.error("Erreur lors de la modification", error);
        alert("Une erreur est survenue lors de la modification.");
      } finally {
        setIsSaving(false);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleLogout = () => {
    removeAuthenticationData();
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (confirm) {
      alert("Votre demande de suppression a été envoyée.");
    }
  };

  const displayName = profil?.prenom ? `${profil.prenom} ${profil.nom}`.toUpperCase() : (user?.prenom || 'JACK ESSOMBA').toUpperCase();

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] font-sans text-gray-900 pb-24">
      
      {/* Top Section - Avatar and Name */}
      <div className="bg-white px-5 py-6 flex items-start justify-between border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shadow-sm border border-gray-100">
            <img 
              src={`https://ui-avatars.com/api/?name=${profil?.prenom || 'User'}+${profil?.nom || ''}&background=000&color=fff&size=150`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold text-gray-900 tracking-wide">{displayName}</h1>
            <p className="text-[13px] text-gray-900">{profil?.etablissement_nom || 'IUT de douala'}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{profil?.matricule || 'IUT202600123AZER'}</p>
          </div>
        </div>
        <button 
          onClick={handleEditToggle}
          disabled={isSaving}
          className="text-[13px] font-medium text-black hover:underline mt-2 disabled:text-gray-400"
        >
          {isSaving ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Modifier'}
        </button>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-6">
        
        {/* Informations Personnelles */}
        <div className="space-y-2">
          <InfoRow 
            label="Email" 
            value={profil?.email || user?.email || 'Non renseigné'} 
            isEditing={isEditing}
            editValue={formData.email}
            onChange={(val) => setFormData({...formData, email: val})}
            type="email"
          />
          <InfoRow 
            label="Numéro" 
            value={profil?.telephone || user?.telephone || 'Non renseigné'} 
            isEditing={isEditing}
            editValue={formData.telephone}
            onChange={(val) => setFormData({...formData, telephone: val})}
            type="tel"
          />
          <InfoRow label="Date et lieu de naissance" value="10/04/2007 - Yde" />
          <InfoRow 
            label="Filière" 
            value={profil?.filiere || 'Non renseigné'} 
            isEditing={isEditing}
            editValue={formData.filiere}
            onChange={(val) => setFormData({...formData, filiere: val})}
          />
          <InfoRow 
            label="Niveau" 
            value={profil?.niveau || 'Non renseigné'} 
            isEditing={isEditing}
            editValue={formData.niveau}
            onChange={(val) => setFormData({...formData, niveau: val})}
          />
          <InfoRow label="Cycle" value="LICENCE" />
          <InfoRow label="Promotion" value="2025 -2026" />
          <InfoRow label="Nom du tuteur" value="MBARGA PIERRE" />
          <InfoRow label="Numéro du tuteur" value="+237 657 45 66 89" />
        </div>

        {/* Responsable académique */}
        <div>
          <h2 className="text-[13px] font-medium text-gray-800 mb-2 ml-1">Responsable académique</h2>
          <ContactCard nom="MBIEZE" telephone="+237 677548933" email="jacques@gmail.com" />
        </div>

        {/* Encadreur académique */}
        <div>
          <h2 className="text-[13px] font-medium text-gray-800 mb-2 ml-1">Encadreur académique</h2>
          <ContactCard nom="MBIEZE" telephone="+237 677548933" email="jacques@gmail.com" />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center bg-white border border-gray-200 rounded-xl px-4 py-4 text-[15px] font-medium text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-600" />
            Me déconnecter
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            className="w-full flex items-center bg-white border border-gray-200 rounded-xl px-4 py-4 text-[15px] font-medium text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Trash2 className="w-5 h-5 mr-3 text-gray-900" />
            Supprimer mon compte
          </button>
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value, isEditing, editValue, onChange, type = "text" }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[13px] text-gray-700">{label}</span>
      {isEditing && onChange ? (
        <input 
          type={type}
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          className="text-[13px] font-medium text-gray-900 text-right bg-gray-50 border border-gray-200 rounded px-2 py-0.5 w-1/2 focus:outline-none focus:border-black"
        />
      ) : (
        <span className="text-[13px] font-medium text-gray-900 text-right">{value}</span>
      )}
    </div>
  );
}

function ContactCard({ nom, telephone, email }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-gray-700">Nom</span>
          <span className="text-[14px] font-medium text-gray-900 uppercase">{nom}</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-gray-700">Téléphone</span>
          <span className="text-[14px] font-medium text-gray-900">{telephone}</span>
        </div>
        <hr className="border-gray-100" />
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-gray-700">Email</span>
          <span className="text-[14px] font-medium text-gray-900">{email}</span>
        </div>
      </div>
      <div className="bg-white px-3 py-3 flex space-x-3 border-t border-gray-100">
        <button className="flex-1 py-2 rounded-lg border border-gray-300 text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition-colors">
          Appeler
        </button>
        <button className="flex-1 py-2 rounded-lg border border-gray-300 text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition-colors">
          Message
        </button>
        <button className="flex-1 py-2 rounded-lg border border-gray-300 text-[13px] font-medium text-gray-900 hover:bg-gray-50 transition-colors">
          Email
        </button>
      </div>
    </div>
  );
}
