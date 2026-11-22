import { CatalogueScreen } from '../views/screens/CatalogueScreen';
import { useCatalogue } from './useCatalogue';

export const CatalogueController = ({ versionExterne, actif }) => {
  const catalogue = useCatalogue(versionExterne, actif);
  return <CatalogueScreen {...catalogue} />;
};
