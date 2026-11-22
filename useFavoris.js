import { useState, useEffect, useCallback } from 'react';
import { initDb, listerProduitsFavoris, basculerFavori } from '../models';
import { useAuth } from './AuthContext';
import { usePanier } from './PanierContext';

// Contrôleur de l'écran Favoris : les produits mis en favori, avec fiche et ajout au panier.
// actif : l'onglet est affiché (la liste est relue à ce moment-là).
export const useFavoris = ({ actif, versionExterne = 0 } = {}) => {
  const { utilisateur } = useAuth();
  const { ajouter, quantites } = usePanier();

  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [produitOuvert, setProduitOuvert] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!actif) return undefined;
    let courant = true;
    initDb()
      .then(() => listerProduitsFavoris(utilisateur.id))
      .then((liste) => {
        if (courant) {
          setProduits(liste);
          setErreur(null);
        }
      })
      .catch((e) => {
        console.log(e);
        if (courant) setErreur('Impossible de charger vos favoris');
      })
      .finally(() => {
        if (courant) setChargement(false);
      });
    return () => {
      courant = false;
    };
  }, [actif, utilisateur.id, versionExterne, version]);

  // Sur cet écran, basculer un favori le retire de la liste
  const onToggleFavori = useCallback(
    (produitId) => {
      setProduits((liste) => liste.filter((p) => p.id !== produitId));
      basculerFavori(utilisateur.id, produitId).catch(console.log);
    },
    [utilisateur.id]
  );

  return {
    produits, chargement, erreur, quantites, produitOuvert,
    favoris: produits.map((p) => p.id),
    onOuvrir: setProduitOuvert,
    onFermer: () => setProduitOuvert(null),
    onToggleFavori, onAjouter: ajouter,
    onReessayer: () => {
      setChargement(true);
      setVersion((v) => v + 1);
    },
  };
};
