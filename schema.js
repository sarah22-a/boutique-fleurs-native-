import { getDb } from './connexion';
import { initProduits } from './produits';
import { initAdmin } from './utilisateurs';

let initPromise = null;

// Appelable plusieurs fois : la base n'est préparée qu'une seule fois
export const initDb = () => {
  if (!initPromise) {
    initPromise = (async () => {
      const db = await getDb();
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS utilisateurs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT NOT NULL,
          prenom TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          telephone TEXT,
          mdp TEXT NOT NULL,
          newsletter INTEGER NOT NULL DEFAULT 0,
          cgu INTEGER NOT NULL DEFAULT 0,
          cree_le TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          role TEXT NOT NULL DEFAULT 'client'
        );

        CREATE TABLE IF NOT EXISTS produits (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          nom       TEXT    NOT NULL,
          nom_norm  TEXT    NOT NULL,
          categorie TEXT    NOT NULL,
          prix      REAL    NOT NULL,
          stock     INTEGER NOT NULL DEFAULT 0
        );

        -- Utilisateur resté connecté (une seule ligne)
        CREATE TABLE IF NOT EXISTS session (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE
        );

        -- Un panier par utilisateur, conservé même si l'appli est fermée
        CREATE TABLE IF NOT EXISTS panier (
          utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
          produit_id INTEGER NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
          quantite INTEGER NOT NULL DEFAULT 1,
          PRIMARY KEY (utilisateur_id, produit_id)
        );

        CREATE TABLE IF NOT EXISTS favoris (
          utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
          produit_id INTEGER NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
          PRIMARY KEY (utilisateur_id, produit_id)
        );

      `);

      // Base créée avant l'espace admin : on ajoute la colonne role sans perdre les comptes
      const colonnes = await db.getAllAsync('PRAGMA table_info(utilisateurs)');
      if (!colonnes.some((c) => c.name === 'role')) {
        await db.execAsync("ALTER TABLE utilisateurs ADD COLUMN role TEXT NOT NULL DEFAULT 'client'");
      }

      await initProduits();
      await initAdmin();
    })().catch((e) => {
      initPromise = null; // permet de réessayer
      throw e;
    });
  }
  return initPromise;
};
