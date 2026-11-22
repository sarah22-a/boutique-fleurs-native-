import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import styles from './PanierStyles';
import { formaterPrix } from '../../utils/texte';
import LignePanier from '../components/LignePanier';
import { CodePromo } from '../components/CodePromo';

// Vue : affichage seul. Tout arrive par props depuis PanierController.
export const PanierScreen = ({
  lignes, total, remise, codePromo, nombreArticles, quantiteMax,
  onChangerQuantite, onRetirer, onVider, onAppliquerCode, onRetirerCode, onCatalogue,
}) => {
  const confirmerVider = () =>
    Alert.alert('Vider le panier ?', 'Toutes les fleurs seront retirées.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: onVider },
    ]);

  return (
    <View style={styles.ecran}>
      <View style={styles.entete}>
        <Text style={styles.titre}>Panier</Text>
        {nombreArticles > 0 && (
          <Text style={styles.sousTitre}>
            {nombreArticles} article{nombreArticles > 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <FlatList
        data={lignes}
        keyExtractor={(l) => String(l.id)}
        contentContainerStyle={styles.liste}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.videZone}>
            <Text style={styles.videTitre}>Votre panier est vide</Text>
            <Text style={styles.vide}>Les fleurs que vous ajoutez apparaissent ici.</Text>
            <Pressable
              onPress={onCatalogue}
              style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
            >
              <Text style={styles.boutonTexte}>Voir le catalogue</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          lignes.length > 0 ? (
            <CodePromo
              codeActif={codePromo}
              remise={remise}
              onAppliquer={onAppliquerCode}
              onRetirer={onRetirerCode}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <LignePanier
            ligne={item}
            max={Math.min(quantiteMax, item.stock)}
            onChangerQuantite={onChangerQuantite}
            onRetirer={onRetirer}
          />
        )}
      />

      {lignes.length > 0 && (
        <View style={styles.pied}>
          <View style={styles.detailLigne}>
            <Text style={styles.detailTexte}>Sous-total</Text>
            <Text style={styles.detailTexte}>{formaterPrix(total)}</Text>
          </View>
          {remise > 0 && (
            <View style={styles.detailLigne}>
              <Text style={styles.detailRemise}>Réduction ({codePromo})</Text>
              <Text style={styles.detailRemise}>−{formaterPrix(remise)}</Text>
            </View>
          )}
          <View style={[styles.totalLigne, { marginTop: 10 }]}>
            <View>
              <Text style={styles.totalLibelle}>Total</Text>
              <Text style={styles.totalDetail}>
                {nombreArticles} article{nombreArticles > 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={styles.total}>{formaterPrix(total - remise)}</Text>
          </View>
          <Pressable onPress={confirmerVider} hitSlop={8}>
            <Text style={styles.vider}>Vider le panier</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
