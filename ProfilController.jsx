import { ProfilScreen } from '../views/screens/ProfilScreen';
import { useProfil } from './useProfil';

export const ProfilController = ({ actif }) => {
  const profil = useProfil({ actif });
  return <ProfilScreen {...profil} />;
};
