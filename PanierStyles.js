import { StyleSheet } from 'react-native';
import { COULEURS as C, SERIF } from '../../theme';

export default StyleSheet.create({
  ecran: { flex: 1, backgroundColor: C.fond },
  entete: { paddingHorizontal: 24, paddingTop: 28 },
  titre: { fontFamily: SERIF, fontSize: 32, color: C.texte },
  sousTitre: { fontSize: 14, color: C.texteDoux, marginTop: 6 },
  liste: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32, flexGrow: 1 },

  // Panier vide : un message, une phrase d'aide et un bouton
  videZone: { alignItems: 'center', marginTop: 72, paddingHorizontal: 16 },
  videTitre: { fontFamily: SERIF, fontSize: 22, color: C.texte, textAlign: 'center' },
  vide: { textAlign: 'center', color: C.texteDoux, fontSize: 15, lineHeight: 22, marginTop: 10 },
  bouton: {
    backgroundColor: C.accent,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 28,
  },
  boutonTexte: { color: '#fff', fontSize: 16, fontWeight: '600' },
  boutonPresse: { opacity: 0.7 },

  // Pied du panier : un volet blanc qui se détache légèrement du fond
  pied: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 20,
    shadowColor: C.accent,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 10,
  },
  totalLigne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  totalLibelle: { fontSize: 15, color: C.texte },
  totalDetail: { fontSize: 13, color: C.texteDoux, marginTop: 3 },
  total: { fontFamily: SERIF, fontSize: 28, color: C.texte },
  detailLigne: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailTexte: { fontSize: 14, color: C.texteDoux },
  detailRemise: { fontSize: 14, color: C.succes },
  vider: { color: C.texteDoux, fontSize: 13, textAlign: 'center', marginTop: 16 },
});
