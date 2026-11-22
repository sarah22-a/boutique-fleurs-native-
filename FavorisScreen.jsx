import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import styles from './NouveautesStyles';
import catalogue from './CatalogueStyles';
import { COULEURS } from '../../theme';
import ProduitCard from '../components/ProduitCard';
import { FicheProduit } from '../components/FicheProduit';

// Vue : les favoris. Tout arrive par props depuis FavorisController.
export const FavorisScreen = ({
  produits, chargement, erreur, quantites, favoris, produitOuvert,
  onOuvrir, onFermer, onToggleFavori, onAjouter, onReessayer, onCatalogue,
}) => {
  if (chargement) {
    return (
      <View style={[styles.ecran, styles.centre]}>
        <ActivityIndicator size="large" color={COULEURS.accent} />
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={[styles.ecran, styles.centre]}>
        <Text style={styles.messageErreur}>{erreur}</Text>
        <Pressable onPress={onReessayer} style={({ pressed }) => [styles.bouton, pressed && styles.presse]}>
          <Text style={styles.boutonTexte}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.ecran}>
      <FlatList
        data={produits}
        numColumns={2}
        columnWrapperStyle={catalogue.rangeeGrille}
        extraData={[quantites, favoris]}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.contenu}
        ListHeaderComponent={
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.titre}>Favoris</Text>
            {produits.length > 0 && (
              <Text style={styles.sousTitre}>
                {produits.length} fleur{produits.length > 1 ? 's' : ''} préférée{produits.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.videZone}>
            <Text style={styles.videTitre}>Pas encore de favori</Text>
            <Text style={styles.vide}>Touchez l'étoile d'une fleur pour la retrouver ici.</Text>
            <Pressable onPress={onCatalogue} style={({ pressed }) => [styles.bouton, styles.boutonLarge, pressed && styles.presse]}>
              <Text style={styles.boutonTexte}>Voir le catalogue</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ProduitCard
            produit={item}
            quantite={quantites[item.id] ?? 0}
            estFavori
            onAjouter={onAjouter}
            onToggleFavori={onToggleFavori}
            onOuvrir={onOuvrir}
          />
        )}
      />

      <FicheProduit
        produit={produitOuvert}
        quantite={produitOuvert ? quantites[produitOuvert.id] ?? 0 : 0}
        estFavori={produitOuvert ? favoris.includes(produitOuvert.id) : false}
        onFermer={onFermer}
        onAjouter={onAjouter}
        onToggleFavori={onToggleFavori}
      />
    </View>
  );
};
