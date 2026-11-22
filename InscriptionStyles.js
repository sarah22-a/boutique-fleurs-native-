import { StyleSheet } from 'react-native';
import { COULEURS as C, SERIF } from '../../theme';

// Partagé par l'écran de connexion et l'écran d'inscription
export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.fond },
  contenu: { paddingHorizontal: 28, paddingBottom: 32 },
  marque: { fontFamily: SERIF, fontSize: 18, color: C.accent, marginTop: 16 },
  bandeau: { width: '100%', height: 150, borderRadius: 20, marginTop: 20, backgroundColor: C.roseClair },
  titre: { fontFamily: SERIF, fontSize: 34, color: C.texte, marginTop: 20, marginBottom: 28 },

  groupe: { marginBottom: 22 },
  label: { fontSize: 13, color: C.texteDoux },
  champ: {
    borderBottomWidth: 1,
    borderColor: C.contour,
    paddingVertical: 10,
    fontSize: 17,
    color: C.texte,
  },
  champErreur: { borderColor: C.erreur },
  erreur: { color: C.erreur, fontSize: 13, marginTop: 6 },
  aide: { color: C.texteDoux, fontSize: 12, marginTop: 6 },

  ligneSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  libelle: { fontSize: 16, color: C.texte },

  bouton: {
    backgroundColor: C.accent,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  boutonPresse: { opacity: 0.7 },
  boutonTexte: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
