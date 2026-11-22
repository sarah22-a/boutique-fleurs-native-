import { useState, useEffect } from 'react';
import {
  initDb, listerProduits, listerCategories, insererProduit,
  modifierProduit, modifierStock, supprimerProduit,
} from '../models';
import { validerFormulaireProduit, lirePrix } from '../utils/validation';

const FORM_VIDE = { nom: '', categorie: '', prix: '', stock: '' };

// Contrôleur de l'espace admin : liste, ajout, modification, stock et suppression des produits.
// onModifie est appelé après chaque écriture : la boutique rafraîchit alors le catalogue.
export const useAdminProduits = ({ onModifie } = {}) => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [version, setVersion] = useState(0);

  const [ouvert, setOuvert] = useState(false);
  const [editionId, setEditionId] = useState(null); // null = nouveau produit
  const [form, setForm] = useState(FORM_VIDE);
  const [erreurs, setErreurs] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState(null);

  useEffect(() => {
    let actuel = true;
    const lire = async () => {
      try {
        await initDb();
        const [liste, cats] = await Promise.all([listerProduits(), listerCategories()]);
        if (actuel) {
          setProduits(liste);
          setCategories(cats);
          setErreur(null);
        }
      } catch (e) {
        console.log(e);
        if (actuel) setErreur('Impossible de charger les produits');
      } finally {
        if (actuel) setChargement(false);
      }
    };
    lire();
    return () => {
      actuel = false;
    };
  }, [version]);

  const apresEcriture = () => {
    setVersion((v) => v + 1);
    onModifie?.();
  };

  const onReessayer = () => {
    setChargement(true);
    setVersion((v) => v + 1);
  };

  const ouvrirFormulaire = (id, valeurs) => {
    setEditionId(id);
    setForm(valeurs);
    setErreurs({});
    setErreurGenerale(null);
    setOuvert(true);
  };

  const onNouveau = () => ouvrirFormulaire(null, FORM_VIDE);

  const onEditer = (produit) =>
    ouvrirFormulaire(produit.id, {
      nom: produit.nom,
      categorie: produit.categorie,
      prix: String(produit.prix).replace('.', ','),
      stock: String(produit.stock),
    });

  const onFermer = () => setOuvert(false);

  const onChange = (champ, valeur) => setForm((f) => ({ ...f, [champ]: valeur }));

  const onEnregistrer = async () => {
    const e = validerFormulaireProduit(form);
    setErreurs(e);
    if (Object.keys(e).length > 0) return;

    const nom = form.nom.trim();
    const categorie = form.categorie.trim();
    const prix = lirePrix(form.prix);
    const stock = Number.parseInt(form.stock, 10);

    try {
      if (editionId === null) {
        await insererProduit(nom, categorie, prix, stock);
      } else {
        await modifierProduit(editionId, nom, categorie, prix, stock);
      }
      setOuvert(false);
      apresEcriture();
    } catch (err) {
      console.log(err);
      setErreurGenerale("Impossible d'enregistrer le produit");
    }
  };

  const onAjusterStock = async (produit, variation) => {
    const stock = Math.max(0, produit.stock + variation);
    if (stock === produit.stock) return;
    try {
      await modifierStock(produit.id, stock);
      apresEcriture();
    } catch (err) {
      console.log(err);
      setErreur('Impossible de modifier le stock');
    }
  };

  const onSupprimer = async (produit) => {
    try {
      await supprimerProduit(produit.id);
      apresEcriture();
    } catch (err) {
      console.log(err);
      setErreur('Impossible de supprimer le produit');
    }
  };

  return {
    produits, categories, chargement, erreur,
    formulaire: { ouvert, enEdition: editionId !== null, form, erreurs, erreurGenerale },
    onReessayer, onNouveau, onEditer, onFermer, onChange, onEnregistrer,
    onAjusterStock, onSupprimer,
  };
};
