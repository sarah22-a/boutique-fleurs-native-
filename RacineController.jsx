import { useAuth } from './AuthContext';
import { PanierProvider } from './PanierContext';
import { InviteController } from './InviteController';
import { BoutiqueController } from './BoutiqueController';
import { EcranChargement } from '../views/components/EcranChargement';

// Équivalent de <ProtectedRoute> : chargement, puis boutique ou connexion
export const RacineController = () => {
  const { utilisateur, chargement } = useAuth();

  if (chargement) return <EcranChargement />;
  if (!utilisateur) return <InviteController />;

  // key : un panier tout neuf pour chaque utilisateur connecté
  return (
    <PanierProvider key={utilisateur.id} utilisateurId={utilisateur.id}>
      <BoutiqueController />
    </PanierProvider>
  );
};
