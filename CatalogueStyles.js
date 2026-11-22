import { StyleSheet } from 'react-native';
import { COULEURS as C, SERIF } from '../../theme';

export default StyleSheet.create({
  ecran: { flex: 1, backgroundColor: C.fond },
  centre: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  fixe: { paddingHorizontal: 24, paddingTop: 28 },
  titre: { fontFamily: SERIF, fontSize: 32, color: C.texte },
  sousTitre: { fontSize: 14, color: C.texteDoux, marginTop: 6 },

  // Hauteur fixe et flexShrink 0 : la liste des puces ne s'écrase plus quand l'écran est petit
  listePuces: { flexGrow: 0, flexShrink: 0, height: 72 },
  puces: { paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' },
  puce: {
    borderWidth: 1,
    borderColor: C.contour,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  puceActive: { backgroundColor: C.accent, borderColor: C.accent },
  puceTexte: { fontSize: 14, color: C.texteDoux },
  puceTexteActive: { color: '#fff', fontWeight: '600' },

  // Bannière en haut de la liste
  banniere: { height: 140, backgroundColor: C.accent, borderRadius: 28, overflow: 'hidden', marginBottom: 28, justifyContent: 'flex-end' },
  banniereContenu: { padding: 22 },
  banniereTitre: { fontFamily: SERIF, fontSize: 26, color: '#fff' },
  banniereSous: { fontSize: 14, color: 'rgba(255,255,255,0.92)', marginTop: 4 },

  liste: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 40 },
  rangeeGrille: { justifyContent: 'space-between', marginBottom: 32 },
  vide: { textAlign: 'center', color: C.texteDoux, fontSize: 16, marginTop: 48, lineHeight: 24 },
  pied: { paddingVertical: 16 },

  messageErreur: { color: C.erreur, fontSize: 16, textAlign: 'center', marginBottom: 16 },
  bouton: {
    backgroundColor: C.accent,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  boutonPresse: { opacity: 0.7 },
  boutonTexte: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
