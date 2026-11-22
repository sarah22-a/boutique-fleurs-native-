import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './ComposantsStyles';
import { COULEURS } from '../../theme';

// Vue : `onglets` = [{ id, libelle, compte }], `onglet` = id de l'onglet actif
export const BarreOnglets = ({ onglets, onglet, onChange }) => (
  <SafeAreaView edges={['bottom']} style={{ backgroundColor: COULEURS.fond }}>
    <View style={styles.onglets}>
      {onglets.map((o) => {
        const actif = onglet === o.id;
        return (
          <Pressable key={o.id} onPress={() => onChange(o.id)} style={styles.onglet}>
            <View style={styles.ongletLigne}>
              <Text style={[styles.ongletTexte, actif && styles.ongletTexteActif]}>{o.libelle}</Text>
              {o.compte > 0 && (
                <View style={styles.ongletPastille}>
                  <Text style={styles.ongletPastilleTexte}>{o.compte}</Text>
                </View>
              )}
            </View>
            <View style={[styles.ongletPoint, actif && styles.ongletPointActif]} />
          </Pressable>
        );
      })}
    </View>
  </SafeAreaView>
);
