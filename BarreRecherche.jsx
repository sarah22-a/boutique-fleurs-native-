import { View, TextInput, Pressable, Text } from 'react-native';
import styles from './ComposantsStyles';
import { COULEURS } from '../../theme';

export const BarreRecherche = ({ valeur, onChange, onEffacer }) => (
  <View style={styles.rechercheZone}>
    <TextInput
      style={styles.champRecherche}
      placeholder="Rechercher une fleur"
      placeholderTextColor={COULEURS.placeholder}
      autoCorrect={false}
      value={valeur}
      onChangeText={onChange}
    />
    {valeur !== '' && (
      <Pressable
        style={styles.effacer}
        onPress={onEffacer}
        accessibilityRole="button"
        accessibilityLabel="Effacer la recherche"
      >
        <Text style={styles.effacerTexte}>×</Text>
      </Pressable>
    )}
  </View>
);
