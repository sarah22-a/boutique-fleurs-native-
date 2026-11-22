import {
  View, Text, TextInput, FlatList, Pressable, Modal, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import styles from './AdminStyles';
import { COULEURS } from '../../theme';
import { formaterPrix } from '../../utils/texte';

// Une ligne de la liste : infos, stock (− / +), modifier, supprimer
const LigneAdmin = ({ produit, onAjusterStock, onEditer, onSupprimer }) => {
  const confirmerSuppression = () =>
    Alert.alert(`Supprimer « ${produit.nom} » ?`, 'Il sera aussi retiré des paniers et des favoris.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onSupprimer(produit) },
    ]);

  return (
    <View style={styles.carte}>
      <View style={styles.carteHaut}>
        <View style={styles.carteTexte}>
          <Text style={styles.nom}>{produit.nom}</Text>
          <Text style={styles.categorie}>{produit.categorie}</Text>
        </View>
        <Text style={styles.prix}>{formaterPrix(produit.prix)}</Text>
      </View>

      <View style={styles.carteBas}>
        <View style={styles.stock}>
          <Pressable
            style={[styles.pas, produit.stock === 0 && styles.inactif]}
            disabled={produit.stock === 0}
            onPress={() => onAjusterStock(produit, -1)}
            accessibilityRole="button"
            accessibilityLabel="Retirer un au stock"
          >
            <Text style={styles.pasTexte}>−</Text>
          </Pressable>
          <Text style={[styles.stockNombre, produit.stock === 0 && styles.stockRupture]}>
            {produit.stock === 0 ? 'Rupture' : `Stock ${produit.stock}`}
          </Text>
          <Pressable
            style={styles.pas}
            onPress={() => onAjusterStock(produit, 1)}
            accessibilityRole="button"
            accessibilityLabel="Ajouter un au stock"
          >
            <Text style={styles.pasTexte}>+</Text>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => onEditer(produit)} hitSlop={8}>
            <Text style={styles.action}>Modifier</Text>
          </Pressable>
          <Pressable onPress={confirmerSuppression} hitSlop={8}>
            <Text style={[styles.action, styles.actionSupprimer]}>Supprimer</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Fenêtre d'ajout / modification d'un produit
const FormulaireProduit = ({ formulaire, categories, onChange, onEnregistrer, onFermer }) => {
  const { ouvert, enEdition, form, erreurs, erreurGenerale } = formulaire;

  const champ = (cle, libelle, props = {}) => (
    <View style={styles.groupe}>
      <Text style={styles.label}>{libelle}</Text>
      <TextInput
        style={[styles.champ, erreurs[cle] && styles.champErreur]}
        placeholderTextColor={COULEURS.placeholder}
        value={form[cle]}
        onChangeText={(t) => onChange(cle, t)}
        {...props}
      />
      {erreurs[cle] && <Text style={styles.erreur}>{erreurs[cle]}</Text>}
    </View>
  );

  return (
    <Modal visible={ouvert} animationType="slide" onRequestClose={onFermer}>
      <KeyboardAvoidingView
        style={styles.modal}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.modalContenu} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitre}>{enEdition ? 'Modifier le produit' : 'Nouveau produit'}</Text>

          {champ('nom', 'Nom', { placeholder: 'Pivoines blush', autoCapitalize: 'sentences' })}

          {champ('categorie', 'Catégorie', { placeholder: 'Bouquets', autoCapitalize: 'sentences' })}
          {categories.length > 0 && (
            <View style={[styles.suggestions, { marginTop: -6, marginBottom: 12 }]}>
              {categories.map((c) => {
                const actif = form.categorie.trim() === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => onChange('categorie', c)}
                    style={[styles.suggestion, actif && styles.suggestionActive]}
                  >
                    <Text style={[styles.suggestionTexte, actif && styles.suggestionTexteActive]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.deuxColonnes}>
            <View style={styles.colonne}>
              {champ('prix', 'Prix (€)', { placeholder: '39,00', keyboardType: 'decimal-pad' })}
            </View>
            <View style={styles.espaceColonne} />
            <View style={styles.colonne}>
              {champ('stock', 'Stock', { placeholder: '10', keyboardType: 'number-pad' })}
            </View>
          </View>

          {erreurGenerale && <Text style={styles.erreur}>{erreurGenerale}</Text>}

          <Pressable
            onPress={onEnregistrer}
            style={({ pressed }) => [styles.bouton, { marginTop: 8 }, pressed && styles.boutonPresse]}
          >
            <Text style={styles.boutonTexte}>Enregistrer</Text>
          </Pressable>
          <Pressable onPress={onFermer} hitSlop={8}>
            <Text style={styles.annuler}>Annuler</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Vue : affichage seul. Tout arrive par props depuis AdminController.
export const AdminScreen = ({
  produits, categories, chargement, erreur, formulaire,
  onReessayer, onNouveau, onEditer, onFermer, onChange, onEnregistrer,
  onAjusterStock, onSupprimer,
}) => {
  if (chargement) {
    return (
      <View style={[styles.ecran, styles.centre]}>
        <ActivityIndicator size="large" color={COULEURS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.ecran}>
      <FlatList
        data={produits}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <View style={styles.entete}>
            <Text style={styles.titre}>Administration</Text>
            <Text style={styles.sousTitre}>
              {produits.length} produit{produits.length > 1 ? 's' : ''}
            </Text>
            <Pressable
              onPress={onNouveau}
              style={({ pressed }) => [styles.bouton, styles.boutonNouveau, pressed && styles.boutonPresse]}
            >
              <Text style={styles.boutonTexte}>+ Nouveau produit</Text>
            </Pressable>
            {erreur && (
              <View style={{ marginTop: 14 }}>
                <Text style={[styles.erreur, { fontSize: 14 }]}>{erreur}</Text>
                <Pressable onPress={onReessayer} hitSlop={8}>
                  <Text style={[styles.action, { marginLeft: 0, marginTop: 6 }]}>Réessayer</Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <LigneAdmin
            produit={item}
            onAjusterStock={onAjusterStock}
            onEditer={onEditer}
            onSupprimer={onSupprimer}
          />
        )}
      />

      <FormulaireProduit
        formulaire={formulaire}
        categories={categories}
        onChange={onChange}
        onEnregistrer={onEnregistrer}
        onFermer={onFermer}
      />
    </View>
  );
};
