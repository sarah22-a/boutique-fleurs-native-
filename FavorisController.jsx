import { FavorisScreen } from '../views/screens/FavorisScreen';
import { useFavoris } from './useFavoris';

export const FavorisController = ({ actif, versionExterne, onCatalogue }) => {
  const favoris = useFavoris({ actif, versionExterne });
  return <FavorisScreen {...favoris} onCatalogue={onCatalogue} />;
};
