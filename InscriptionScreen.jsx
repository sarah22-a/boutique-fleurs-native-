import {
  View, Text, TextInput, Switch, Pressable, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './InscriptionStyles';
import { COULEURS } from '../../theme';
import { MDP_MIN } from '../../utils/validation';

// Vue : affichage seul. Tout arrive par props depuis InscriptionController.
export const InscriptionScreen = ({
  form, erreurs, erreurGenerale, newsletter, cgu, afficher, nomRef,
  onChange, onNewsletter, onCgu, onAfficher, onSubmit,
}) => {
  const champTexte = (champ, libelle, props = {}, aide = null) => (
    <View style={styles.groupe}>
      <Text style={styles.label}>{libelle}</Text>
      <TextInput
        style={[styles.champ, erreurs[champ] && styles.champErreur]}
        placeholderTextColor={COULEURS.placeholder}
        value={form[champ]}
        onChangeText={(t) => onChange(champ, t)}
        {...props}
      />
      {erreurs[champ]
        ? <Text style={styles.erreur}>{erreurs[champ]}</Text>
        : aide && <Text style={styles.aide}>{aide}</Text>}
    </View>
  );

  const interrupteur = (libelle, valeur, onValeur) => (
    <View style={styles.ligneSwitch}>
      <Text style={styles.libelle}>{libelle}</Text>
      <Switch
        value={valeur}
        onValueChange={onValeur}
        trackColor={{ true: COULEURS.rose }}
        thumbColor={valeur ? COULEURS.accent : undefined}
      />
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <Text style={styles.marque}>Maison Pétale</Text>
          <Text style={styles.titre}>Créer un compte</Text>

          {champTexte('nom', 'Nom', { ref: nomRef, placeholder: 'Dupont', autoCapitalize: 'words' })}
          {champTexte('prenom', 'Prénom', { placeholder: 'Marie', autoCapitalize: 'words' })}
          {champTexte('email', 'Email', {
            placeholder: 'marie@mail.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
          })}
          {champTexte('telephone', 'Téléphone (facultatif)', {
            placeholder: '06 12 34 56 78',
            keyboardType: 'phone-pad',
          })}
          {champTexte('mdp', 'Mot de passe', {
            placeholder: '••••••••••••',
            secureTextEntry: !afficher,
            autoCapitalize: 'none',
          }, `${MDP_MIN} caractères minimum`)}
          {champTexte('confirmation', 'Confirmer le mot de passe', {
            placeholder: '••••••••••••',
            secureTextEntry: !afficher,
            autoCapitalize: 'none',
          })}

          {interrupteur('Afficher le mot de passe', afficher, onAfficher)}
          {interrupteur('Recevoir la newsletter', newsletter, onNewsletter)}
          {interrupteur("J'accepte les CGU", cgu, onCgu)}
          {erreurs.cgu && <Text style={styles.erreur}>{erreurs.cgu}</Text>}

          {erreurGenerale && <Text style={styles.erreur}>{erreurGenerale}</Text>}

          <Pressable
            onPress={onSubmit}
            style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
          >
            <Text style={styles.boutonTexte}>Créer mon compte</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
