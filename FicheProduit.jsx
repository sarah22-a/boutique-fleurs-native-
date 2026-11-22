import { View, Text, ScrollView, Pressable, Modal, useWindowDimensions } from 'react-native';
import styles from './NouveautesStyles';
import { PhotoProduit } from './PhotoProduit';
import { formaterPrix } from '../../utils/texte';
import { descriptionDe } from '../../utils/descriptions';

const STOCK_BAS = 5;

// Fiche produit (plein écran) : grande photo, description, conseils d'entretien, ajout au panier.
// Ne s'affiche que si `produit` n'est pas null (le contrôleur décide quand l'ouvrir).
export const FicheProduit = ({ produit, quantite, estFavori, onFermer, onAjouter, onToggleFavori }) => {
  const { width } = useWindowDimensions();
  if (!produit) return null;

  const { texte, entretien } = descriptionDe(produit);
  const rupture = produit.stock === 0;
  const stockBas = !rupture && produit.stock <= STOCK_BAS;

  let libelleStock = 'En stock';
  if (rupture) libelleStock = 'Rupture de stock';
  else if (stockBas) libelleStock = `Plus que ${produit.stock} en stock`;

  return (
    <Modal visible animationType="slide" onRequestClose={onFermer}>
      <View style={styles.fiche}>
        <ScrollView contentContainerStyle={styles.ficheContenu}>
          <View style={styles.fichePhoto}>
            <PhotoProduit produit={produit} largeur={width} hauteur={Math.round(width * 1.05)} rayon={0} grisee={rupture} />
            <Pressable
              style={styles.ficheFermer}
              onPress={onFermer}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Fermer la fiche"
            >
              <Text style={styles.ficheFermerTexte}>×</Text>
            </Pressable>
          </View>

          <View style={styles.ficheCorps}>
            <Text style={styles.ficheCategorie}>{produit.categorie}</Text>
            <View style={styles.ficheTitreLigne}>
              <Text style={styles.ficheTitre}>{produit.nom}</Text>
              <Text style={styles.fichePrix}>{formaterPrix(produit.prix)}</Text>
            </View>
            <Text style={[styles.ficheStock, rupture && styles.ficheStockRupture]}>{libelleStock}</Text>

            <Text style={styles.ficheTexte}>{texte}</Text>
            <View style={styles.ficheEntretien}>
              <Text style={styles.ficheEntretienTitre}>Conseil d'entretien</Text>
              <Text style={styles.ficheEntretienTexte}>{entretien}</Text>
            </View>

            <Pressable
              disabled={rupture}
              onPress={() => onAjouter(produit)}
              style={({ pressed }) => [styles.ficheBouton, rupture && styles.inactif, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
            >
              <Text style={styles.ficheBoutonTexte}>{rupture ? 'Indisponible' : 'Ajouter au panier'}</Text>
            </Pressable>
            {quantite > 0 && <Text style={styles.ficheDansPanier}>{quantite} déjà dans votre panier</Text>}

            <Pressable onPress={() => onToggleFavori(produit.id)} hitSlop={8} accessibilityRole="button">
              <Text style={styles.ficheFavori}>{estFavori ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
