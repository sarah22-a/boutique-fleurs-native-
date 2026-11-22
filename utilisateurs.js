import { getDb } from './connexion';

// ATTENTION : mot de passe stocké en clair (comme sur le site, usage d'apprentissage).
export const insererUtilisateur = async ({
  nom, prenom, email, telephone, mdp, newsletter, cgu,
}) => {
  const db = await getDb();
  const resultat = await db.runAsync(
    `INSERT INTO utilisateurs
       (nom, prenom, email, telephone, mdp, newsletter, cgu)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    nom.trim(),
    prenom.trim(),
    email.trim().toLowerCase(),
    telephone || null,
    mdp,
    newsletter ? 1 : 0,
    cgu ? 1 : 0
  );
  return resultat.lastInsertRowId;
};

// Renvoie l'utilisateur si l'email et le mot de passe correspondent, sinon null
export const verifierConnexion = async (email, mdp) => {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT id, nom, prenom, email, role, telephone, cree_le FROM utilisateurs
     WHERE email = ? AND mdp = ?`,
    email.trim().toLowerCase(),
    mdp
  );
};

// Compte administrateur créé au premier lancement (à changer avant toute vraie mise en ligne)
export const ADMIN_EMAIL = 'admin@maisonpetale.fr';
export const ADMIN_MDP = 'AdminPetale2026';

export const initAdmin = async () => {
  const db = await getDb();
  const existant = await db.getFirstAsync("SELECT id FROM utilisateurs WHERE role = 'admin' LIMIT 1");
  if (existant) return;
  await db.runAsync(
    `INSERT OR IGNORE INTO utilisateurs (nom, prenom, email, mdp, newsletter, cgu, role)
     VALUES ('Pétale', 'Admin', ?, ?, 0, 1, 'admin')`,
    ADMIN_EMAIL,
    ADMIN_MDP
  );
};

// Profil : le client peut changer son nom, son prénom et son téléphone (pas son email)
export const modifierProfil = async (id, { nom, prenom, telephone }) => {
  const db = await getDb();
  await db.runAsync(
    'UPDATE utilisateurs SET nom = ?, prenom = ?, telephone = ? WHERE id = ?',
    nom.trim(), prenom.trim(), telephone.trim() || null, id
  );
};
