import { Alert } from 'react-native';
import { InscriptionScreen } from '../views/screens/InscriptionScreen';
import { useInscription } from './useInscription';

export const InscriptionController = ({ onInscrit }) => {
  const { envoyer, ...inscription } = useInscription();

  const soumettre = async () => {
    const prenom = await envoyer();
    if (prenom) {
      Alert.alert('Compte créé', `Bienvenue ${prenom} ! Vous pouvez vous connecter.`, [
        { text: 'Se connecter', onPress: onInscrit },
      ]);
    }
  };

  return <InscriptionScreen {...inscription} onSubmit={soumettre} />;
};
