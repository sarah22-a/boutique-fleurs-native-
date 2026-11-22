import { memo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import styles from './ComposantsStyles';
import { PhotoProduit } from './PhotoProduit';
import { formaterPrix } from '../../utils/texte';

const STOCK_BAS = 5;
export const MARGE_ECRAN = 24; // doit correspondre au padding de la liste
export const ECART_TUILES = 20;

// Une tuile de la grille à deux colonnes : grande photo, catégorie, nom, prix, bouton d'ajout
const ProduitCard = ({ produit, quantite, estFavori, onAjouter, onToggleFavori, onOuvrir }) => {
  const { width } = useWindowDimensions();
  const largeur = Math.floor((width - MARGE_ECRAN * 2 - ECART_TUILES) / 2);
  const rupture = produit.stock === 0;
  const stockBas = !rupture && produit.stock <= STOCK_BAS;
  const dansPanier = quantite > 0;

  return (
    <View style={{ width: largeur }}>
      <View style={styles.photoOmbre}>
        <Pressable
          onPress={() => onOuvrir(produit)}
          accessibilityRole="button"
          accessibilityLabel={`Voir la fiche de ${produit.nom}`}
        >
          <PhotoProduit
            produit={produit}
            largeur={largeur}
            hauteur={Math.round(largeur * 1.25)}
            rayon={22}
            grisee={rupture}
          />
        </Pressable>

        <Pressable
          style={styles.etoileBulle}
          onPress={() => onToggleFavori(produit.id)}
          accessibilityRole="button"
          accessibilityLabel={estFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          hitSlop={8}
        >
          <Text style={styles.etoile}>{estFavori ? '★' : '☆'}</Text>
        </Pressable>

        {(rupture || stockBas) && (
          <View style={styles.badge}>
            <Text style={rupture ? styles.badgeTexte : styles.badgeTexteDoux}>
              {rupture ? 'Rupture de stock' : `Plus que ${produit.stock}`}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.categorie}>{produit.categorie}</Text>
      <Pressable onPress={() => onOuvrir(produit)}>
        <Text style={styles.nomTuile} numberOfLines={2}>{produit.nom}</Text>
      </Pressable>

      <View style={styles.ligneTuile}>
        <Text style={styles.prix}>{formaterPrix(produit.prix)}</Text>
        <Pressable
          disabled={rupture}
          onPress={() => onAjouter(produit)}
          accessibilityRole="button"
          accessibilityLabel={`Ajouter ${produit.nom} au panier`}
          style={[styles.ajouter, dansPanier && styles.ajouterPlein, rupture && styles.inactif]}
        >
          <Text style={dansPanier ? styles.ajouterTextePlein : styles.ajouterTexte}>
            {dansPanier ? quantite : '+'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default memo(ProduitCard);
