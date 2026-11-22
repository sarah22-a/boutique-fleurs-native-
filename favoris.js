import { getDb } from './connexion';

export const listerFavoris = async (utilisateurId) => {
  const db = await getDb();
  const lignes = await db.getAllAsync(
    'SELECT produit_id FROM favoris WHERE utilisateur_id = ?',
    utilisateurId
  );
  return lignes.map((l) => l.produit_id);
};

// Ajoute le favori s'il n'existe pas, le retire sinon
export const basculerFavori = async (utilisateurId, produitId) => {
  const db = await getDb();
  const supprime = await db.runAsync(
    'DELETE FROM favoris WHERE utilisateur_id = ? AND produit_id = ?',
    utilisateurId, produitId
  );
  if (supprime.changes === 0) {
    await db.runAsync(
      'INSERT INTO favoris (utilisateur_id, produit_id) VALUES (?, ?)',
      utilisateurId, produitId
    );
  }
};

// Les produits favoris (objets complets), pour l'écran Favoris
export const listerProduitsFavoris = async (utilisateurId) => {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT p.id, p.nom, p.categorie, p.prix, p.stock
     FROM favoris f JOIN produits p ON p.id = f.produit_id
     WHERE f.utilisateur_id = ?
     ORDER BY p.id`,
    utilisateurId
  );
};
