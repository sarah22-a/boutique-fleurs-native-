import { getDb } from './connexion';
import { normaliser } from '../utils/texte';

export const QUANTITE_MAX = 10;

// [nom, catégorie, prix, stock]
const FLEURS = [
  ['Bouquet de roses roses', 'Bouquets', 39, 15],
  ['Pivoines blush', 'Bouquets', 45, 8],
  ['Tulipes pastel', 'Bouquets', 25, 20],
  ['Bouquet champêtre', 'Bouquets', 32, 12],
  ['Renoncules corail', 'Bouquets', 28, 0],
  ['Roses poudrées (12 tiges)', 'Roses', 49, 10],
  ['Lys rose', 'Roses', 29, 14],
  ['Orchidée blanche', 'Plantes', 35, 6],
  ['Hortensia rose', 'Plantes', 27, 9],
  ['Eucalyptus (botte)', 'Feuillage', 12, 30],
  ['Gypsophile séchée', 'Séchées', 15, 25],
  ['Pampa séché', 'Séchées', 18, 0],
];

// Remplissage au premier lancement (la table est créée dans schema.js).
// nom_norm = nom sans accents ni majuscules : la recherche trouve "pivoine" ou "orchidee".
export const initProduits = async () => {
  const db = await getDb();

  const { n } = await db.getFirstAsync('SELECT COUNT(*) AS n FROM produits');
  if (n > 0) return;

  await db.withTransactionAsync(async () => {
    for (const [nom, categorie, prix, stock] of FLEURS) {
      await db.runAsync(
        'INSERT INTO produits (nom, nom_norm, categorie, prix, stock) VALUES (?, ?, ?, ?, ?)',
        nom, normaliser(nom), categorie, prix, stock
      );
    }
  });
};

// Filtre partagé entre la lecture et le comptage
const FILTRE = 'nom_norm LIKE ? AND (? IS NULL OR categorie = ?)';
const parametresFiltre = (recherche, categorie) => [
  `%${normaliser(recherche)}%`, categorie, categorie,
];

// Lecture d'une page (limite = -1 : tout)
export const listerProduits = async ({
  recherche = '', categorie = null, limite = -1, decalage = 0,
} = {}) => {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT id, nom, categorie, prix, stock FROM produits
     WHERE ${FILTRE}
     ORDER BY id
     LIMIT ? OFFSET ?`,
    ...parametresFiltre(recherche, categorie),
    limite,
    decalage
  );
};

export const compterProduits = async ({ recherche = '', categorie = null } = {}) => {
  const db = await getDb();
  const { n } = await db.getFirstAsync(
    `SELECT COUNT(*) AS n FROM produits WHERE ${FILTRE}`,
    ...parametresFiltre(recherche, categorie)
  );
  return n;
};

export const listerCategories = async () => {
  const db = await getDb();
  const lignes = await db.getAllAsync(
    'SELECT DISTINCT categorie FROM produits ORDER BY categorie'
  );
  return lignes.map((ligne) => ligne.categorie);
};

// Espace administrateur : ajout, modification, stock, suppression
export const insererProduit = async (nom, categorie, prix, stock) => {
  const db = await getDb();
  const resultat = await db.runAsync(
    'INSERT INTO produits (nom, nom_norm, categorie, prix, stock) VALUES (?, ?, ?, ?, ?)',
    nom, normaliser(nom), categorie, prix, stock
  );
  return resultat.lastInsertRowId;
};

export const modifierProduit = async (id, nom, categorie, prix, stock) => {
  const db = await getDb();
  await db.runAsync(
    'UPDATE produits SET nom = ?, nom_norm = ?, categorie = ?, prix = ?, stock = ? WHERE id = ?',
    nom, normaliser(nom), categorie, prix, stock, id
  );
};

export const modifierStock = async (id, stock) => {
  const db = await getDb();
  await db.runAsync('UPDATE produits SET stock = ? WHERE id = ?', stock, id);
};

// Le panier et les favoris qui contiennent ce produit sont supprimés aussi (ON DELETE CASCADE)
export const supprimerProduit = async (id) => {
  const db = await getDb();
  await db.runAsync('DELETE FROM produits WHERE id = ?', id);
};
