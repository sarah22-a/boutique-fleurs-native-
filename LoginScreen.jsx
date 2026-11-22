import {
  View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './InscriptionStyles';
import { COULEURS } from '../../theme';

// Vue : affichage seul. Tout arrive par props depuis LoginController.
export const LoginScreen = ({ form, erreurs, erreurGenerale, emailRef, onChange, onSubmit }) => (
  <SafeAreaView edges={['top']} style={styles.safe}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <Text style={styles.marque}>Maison Pétale</Text>
        <Text style={styles.titre}>Connexion</Text>

        <View style={styles.groupe}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            ref={emailRef}
            style={[styles.champ, erreurs.email && styles.champErreur]}
            placeholder="marie@mail.com"
            placeholderTextColor={COULEURS.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={form.email}
            onChangeText={(t) => onChange('email', t)}
          />
          {erreurs.email && <Text style={styles.erreur}>{erreurs.email}</Text>}
        </View>

        <View style={styles.groupe}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={[styles.champ, erreurs.mdp && styles.champErreur]}
            placeholder="••••••••••••"
            placeholderTextColor={COULEURS.placeholder}
            secureTextEntry
            value={form.mdp}
            onChangeText={(t) => onChange('mdp', t)}
          />
          {erreurs.mdp && <Text style={styles.erreur}>{erreurs.mdp}</Text>}
        </View>

        {erreurGenerale && <Text style={styles.erreur}>{erreurGenerale}</Text>}

        <Pressable
          onPress={onSubmit}
          style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
        >
          <Text style={styles.boutonTexte}>Se connecter</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
