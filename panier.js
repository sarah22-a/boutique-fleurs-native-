import { getDb } from './connexion';
import { QUANTITE_MAX } from './produits';

// Quantité maximale d'un produit : 10, ou moins si le stock est plus petit
const limiteDe = (stock) => Math.min(QUANTITE_MAX, stock);

export const lireLignes = async (utilisateurId) => {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT p.id, p.nom, p.prix, p.stock, l.quantite
     FROM panier l JOIN produits p ON p.id = l.produit_id
     WHERE l.utilisateur_id = ?
     ORDER BY l.rowid`,
    utilisateurId
  );
};

// Produit absent -> nouvelle ligne ; présent -> +1 ; limite atteinte -> rien
export const ajouterAuPanier = async (utilisateurId, produit) => {
  const db = await getDb();
  const limite = limiteDe(produit.stock);
  const existante = await db.getFirstAsync(
    'SELECT quantite FROM panier WHERE utilisateur_id = ? AND produit_id = ?',
    utilisateurId, produit.id
  );

  if (!existante) {
    if (limite < 1) return;
    await db.runAsync(
      'INSERT INTO panier (utilisateur_id, produit_id, quantite) VALUES (?, ?, 1)',
      utilisateurId, produit.id
    );
  } else if (existante.quantite < limite) {
    await db.runAsync(
      'UPDATE panier SET quantite = quantite + 1 WHERE utilisateur_id = ? AND produit_id = ?',
      utilisateurId, produit.id
    );
  }
};

// variation = +1 ou -1 ; la quantité reste entre 1 et la limite
export const changerQuantite = async (utilisateurId, ligne, variation) => {
  const db = await getDb();
  const nouvelle = Math.min(limiteDe(ligne.stock), Math.max(1, ligne.quantite + variation));
  await db.runAsync(
    'UPDATE panier SET quantite = ? WHERE utilisateur_id = ? AND produit_id = ?',
    nouvelle, utilisateurId, ligne.id
  );
};

export const retirerDuPanier = async (utilisateurId, produitId) => {
  const db = await getDb();
  await db.runAsync(
    'DELETE FROM panier WHERE utilisateur_id = ? AND produit_id = ?',
    utilisateurId, produitId
  );
};

export const viderPanier = async (utilisateurId) => {
  const db = await getDb();
  await db.runAsync('DELETE FROM panier WHERE utilisateur_id = ?', utilisateurId);
};
