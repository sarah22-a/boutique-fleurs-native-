import { useState, useEffect, useRef, useCallback } from 'react';
import {
  initDb, listerProduits, compterProduits, listerCategories,
  listerFavoris, basculerFavori,
} from '../models';
import { useAuth } from './AuthContext';
import { usePanier } from './PanierContext';

const TAILLE_PAGE = 10;

// Contrôleur du catalogue : lecture des produits (recherche, catégorie, pagination),
// favoris et ajout au panier. versionExterne change quand l'admin modifie un produit.
// actif : l'onglet est affiché (les favoris sont relus à ce moment-là, ils ont pu changer ailleurs).
export const useCatalogue = (versionExterne = 0, actif = true) => {
  const { utilisateur } = useAuth();
  const { ajouter, quantites } = usePanier();

  const [produits, setProduits] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState(null);
  const [version, setVersion] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [rafraichissement, setRafraichissement] = useState(false);
  const [chargementPlus, setChargementPlus] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [produitOuvert, setProduitOuvert] = useState(null); // fiche produit affichée
  const generation = useRef(0);

  // Catégories et favoris
  useEffect(() => {
    if (!actif) return;
    initDb()
      .then(() => Promise.all([listerCategories(), listerFavoris(utilisateur.id)]))
      .then(([liste, ids]) => {
        setCategories([null, ...liste]);
        setFavoris(ids);
      })
      .catch(console.log);
  }, [utilisateur.id, versionExterne, actif]);

  // La première page : relue dès qu'une dépendance change
  useEffect(() => {
    let actuel = true;
    generation.current += 1;

    const lire = async () => {
      try {
        await initDb();
        const [lignes, nombre] = await Promise.all([
          listerProduits({ recherche, categorie, limite: TAILLE_PAGE, decalage: 0 }),
          compterProduits({ recherche, categorie }),
        ]);
        if (actuel) {
          setProduits(lignes);
          setTotal(nombre);
          setErreur(null);
        }
      } catch (e) {
        console.log(e);
        if (actuel) setErreur('Impossible de charger le catalogue');
      } finally {
        if (actuel) {
          setChargement(false);
          setRafraichissement(false);
        }
      }
    };

    lire();
    return () => {
      actuel = false;
    };
  }, [recherche, categorie, version, versionExterne]);

  const recharger = () => setVersion((v) => v + 1);

  const onReessayer = () => {
    setChargement(true);
    recharger();
  };

  const onRafraichir = () => {
    setRafraichissement(true);
    recharger();
  };

  const onChargerPlus = async () => {
    if (chargementPlus || produits.length >= total) return;

    const lecture = generation.current;
    setChargementPlus(true);
    try {
      const suite = await listerProduits({
        recherche, categorie, limite: TAILLE_PAGE, decalage: produits.length,
      });
      // Un rechargement a eu lieu pendant la lecture : cette page est périmée
      if (lecture !== generation.current) return;
      setProduits((actuels) => [...actuels, ...suite]);
    } catch (e) {
      console.log(e);
    } finally {
      setChargementPlus(false);
    }
  };

  // Référence stable (la mise à jour fonctionnelle évite de dépendre de `favoris`)
  const onToggleFavori = useCallback(
    (produitId) => {
      setFavoris((prev) =>
        prev.includes(produitId) ? prev.filter((x) => x !== produitId) : [...prev, produitId]
      );
      basculerFavori(utilisateur.id, produitId).catch(console.log);
    },
    [utilisateur.id]
  );

  const filtreActif = recherche.trim() !== '' || categorie !== null;

  return {
    produits, total, categories, recherche, categorie, filtreActif,
    chargement, rafraichissement, chargementPlus, erreur, quantites, favoris, produitOuvert,
    onOuvrir: setProduitOuvert,
    onFermer: () => setProduitOuvert(null),
    onRecherche: setRecherche,
    onEffacer: () => setRecherche(''),
    onCategorie: setCategorie,
    onReessayer, onRafraichir, onChargerPlus, onToggleFavori,
    onAjouter: ajouter,
  };
};
