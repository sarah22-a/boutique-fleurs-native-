import { PanierScreen } from '../views/screens/PanierScreen';
import { usePanier } from './PanierContext';

// Le hook usePanier (PanierContext) est le contrôleur du panier : on passe ses valeurs à la vue
export const PanierController = ({ onCatalogue }) => {
  const {
    lignes, total, nombreArticles, codePromo, remise, appliquerCode, retirerCode,
    changerQuantite, retirer, vider, QUANTITE_MAX,
  } = usePanier();

  return (
    <PanierScreen
      lignes={lignes}
      total={total}
      remise={remise}
      codePromo={codePromo}
      nombreArticles={nombreArticles}
      quantiteMax={QUANTITE_MAX}
      onChangerQuantite={changerQuantite}
      onRetirer={retirer}
      onVider={vider}
      onAppliquerCode={appliquerCode}
      onRetirerCode={retirerCode}
      onCatalogue={onCatalogue}
    />
  );
};
