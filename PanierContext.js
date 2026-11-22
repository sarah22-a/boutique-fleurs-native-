import {
  createContext, useContext, useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import {
  lireLignes, ajouterAuPanier, changerQuantite as changerQuantiteDb,
  retirerDuPanier, viderPanier, QUANTITE_MAX,
} from '../models';
import { calculerRemise, verifierCodePromo } from '../utils/commande';

const PanierContext = createContext(null);

// Le panier est enregistré dans SQLite : il survit à la fermeture de l'appli.
// App.js donne key={utilisateurId} : un panier tout neuf pour chaque utilisateur.
export const PanierProvider = ({ utilisateurId, children }) => {
  const [lignes, setLignes] = useState([]);
  // Code promo saisi dans le panier (null = aucun) ; la remise est recalculée à chaque changement
  const [codePromo, setCodePromo] = useState(null);
  // File d'attente : les actions s'exécutent l'une après l'autre (taps rapides)
  const file = useRef(Promise.resolve());

  const recharger = useCallback(async () => {
    setLignes(await lireLignes(utilisateurId));
  }, [utilisateurId]);

  useEffect(() => {
    recharger().catch(console.log);
  }, [recharger]);

  // Plus d'article : le code promo n'a plus d'objet
  useEffect(() => {
    if (lignes.length === 0) setCodePromo(null);
  }, [lignes]);

  const executer = useCallback(
    (action) => {
      file.current = file.current
        .then(action)
        .then(recharger)
        .catch((e) => console.log(e));
      return file.current;
    },
    [recharger]
  );

  const ajouter = useCallback(
    (produit) => executer(() => ajouterAuPanier(utilisateurId, produit)),
    [executer, utilisateurId]
  );
  const changerQuantite = useCallback(
    (ligne, variation) => executer(() => changerQuantiteDb(utilisateurId, ligne, variation)),
    [executer, utilisateurId]
  );
  const retirer = useCallback(
    (produitId) => executer(() => retirerDuPanier(utilisateurId, produitId)),
    [executer, utilisateurId]
  );
  const vider = useCallback(
    () => executer(() => viderPanier(utilisateurId)),
    [executer, utilisateurId]
  );

  // Valeurs dérivées : calculées à partir de `lignes`
  const nombreArticles = useMemo(() => lignes.reduce((s, l) => s + l.quantite, 0), [lignes]);
  const total = useMemo(() => lignes.reduce((s, l) => s + l.prix * l.quantite, 0), [lignes]);
  const remise = useMemo(() => calculerRemise(codePromo, total), [codePromo, total]);

  // Renvoie { ok, message } : la vue affiche le message
  const appliquerCode = useCallback(
    (saisie) => {
      const resultat = verifierCodePromo(saisie, total);
      if (resultat.ok) setCodePromo(resultat.code);
      return resultat;
    },
    [total]
  );
  const retirerCode = useCallback(() => setCodePromo(null), []);

  // { 1: 3, 2: 1 } = 3 exemplaires du produit 1 et 1 du produit 2
  const quantites = useMemo(
    () => Object.fromEntries(lignes.map((l) => [l.id, l.quantite])),
    [lignes]
  );

  const value = useMemo(
    () => ({
      lignes, quantites, nombreArticles, total, codePromo, remise,
      appliquerCode, retirerCode,
      ajouter, changerQuantite, retirer, vider, recharger, QUANTITE_MAX,
    }),
    [lignes, quantites, nombreArticles, total, codePromo, remise, appliquerCode, retirerCode, ajouter, changerQuantite, retirer, vider, recharger]
  );

  return <PanierContext.Provider value={value}>{children}</PanierContext.Provider>;
};

export const usePanier = () => {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error('usePanier doit être utilisé dans <PanierProvider>');
  return ctx;
};
