import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, WalletCards, FileText } from 'lucide-react'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { PageHeader, StatCard, cardStyles, buttonStyles } from '../../../components/ui/designSystem'

export function EstablishmentDashboard() {
  return (
    <DashboardLayout
      title="Espace établissement"
      description="Pilotez les apprenants, les campagnes de frais et le suivi des paiements dans une interface claire."
      actions={
        <div className="flex gap-2">
          <Link to="/etablissement/apprenants/nouveau" className={buttonStyles({ variant: 'primary' })}>
            Ajouter un apprenant
          </Link>
          <Link to="/etablissement/caisses/nouveau" className={buttonStyles({ variant: 'secondary' })}>
            Ajouter un guichet
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Apprenants" value="Gérés" helper="Accès rapide à l’enregistrement des nouveaux profils" tone="secondary" />
        <StatCard icon={WalletCards} label="Paiements" value="Suivis" helper="Les statuts restent visibles et cohérents" tone="primary" />
        <StatCard icon={FileText} label="Reçus" value="Vérifiables" helper="Les documents restent traçables" tone="info" />
        <StatCard icon={LayoutDashboard} label="Configuration" value="Simple" helper="Actions essentielles regroupées" tone="success" />
      </section>

      <section className={cardStyles('p-6')}>
        <PageHeader
          title="Raccourcis utiles"
          description="Les pages existantes restent accessibles sans encombrer l’interface."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/etablissement/apprenants/nouveau" className={buttonStyles({ variant: 'primary' })}>
            Créer un apprenant
          </Link>
          <Link to="/etablissement/caisses/nouveau" className={buttonStyles({ variant: 'secondary' })}>
            Créer un compte Banque / Caisse
          </Link>
          <button className={buttonStyles({ variant: 'secondary' })}>Consulter les paiements</button>
          <button className={buttonStyles({ variant: 'secondary' })}>Télécharger les rapports</button>
        </div>
      </section>
    </DashboardLayout>
  )
}
