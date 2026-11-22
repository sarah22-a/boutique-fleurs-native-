import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import styles from './NouveautesStyles';
import { COULEURS } from '../../theme';
import { formaterDate } from '../../utils/commande';

// Vue : le profil du client. Tout arrive par props depuis ProfilController.
export const ProfilScreen = ({
  utilisateur, form, erreurs, message, stats, onChange, onEnregistrer, onDeconnexion,
}) => {
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
    <KeyboardAvoidingView style={styles.ecran} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <View style={styles.profilEntete}>
          <View style={styles.avatarGrand}>
            <Text style={styles.avatarGrandTexte}>{utilisateur.prenom.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profilNom}>{utilisateur.prenom} {utilisateur.nom}</Text>
            <Text style={styles.profilInfo}>{utilisateur.email}</Text>
            {utilisateur.cree_le && (
              <Text style={styles.profilInfo}>Membre depuis le {formaterDate(utilisateur.cree_le)}</Text>
            )}
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statsCase}>
            <Text style={styles.statsNombre}>{stats.favoris}</Text>
            <Text style={styles.statsLibelle}>favori{stats.favoris > 1 ? 's' : ''}</Text>
          </View>
        </View>

        <Text style={styles.blocTitre}>Mes informations</Text>
        <View style={styles.deuxColonnes}>
          <View style={styles.colonne}>{champ('prenom', 'Prénom', { autoCapitalize: 'words' })}</View>
          <View style={styles.colonne}>{champ('nom', 'Nom', { autoCapitalize: 'words' })}</View>
        </View>
        {champ('telephone', 'Téléphone', { keyboardType: 'phone-pad', placeholder: '06 12 34 56 78' })}

        {erreurs.general && <Text style={styles.messageErreur}>{erreurs.general}</Text>}
        {message && <Text style={styles.succes}>{message}</Text>}

        <Pressable
          onPress={onEnregistrer}
          style={({ pressed }) => [styles.bouton, styles.boutonLarge, pressed && styles.presse]}
          accessibilityRole="button"
        >
          <Text style={styles.boutonTexte}>Enregistrer</Text>
        </Pressable>
        <Pressable onPress={onDeconnexion} hitSlop={8}>
          <Text style={styles.lienDoux}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
