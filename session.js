import { getDb } from './connexion';

export const lireSession = async () => {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT u.id, u.nom, u.prenom, u.email, u.role, u.telephone, u.cree_le
     FROM session s JOIN utilisateurs u ON u.id = s.utilisateur_id
     WHERE s.id = 1`
  );
};

export const ecrireSession = async (utilisateurId) => {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO session (id, utilisateur_id) VALUES (1, ?)',
    utilisateurId
  );
};

export const effacerSession = async () => {
  const db = await getDb();
  await db.runAsync('DELETE FROM session');
};
