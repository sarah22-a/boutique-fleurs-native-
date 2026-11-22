import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  initDb, verifierConnexion, lireSession, ecrireSession, effacerSession,
} from '../models';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Au démarrage : prépare la base et restaure la session (comme localStorage sur le site)
  useEffect(() => {
    let actuel = true;
    initDb()
      .then(lireSession)
      .then((session) => {
        if (actuel && session) setUtilisateur(session);
      })
      .catch((e) => console.log('Erreur init base', e))
      .finally(() => {
        if (actuel) setChargement(false);
      });
    return () => {
      actuel = false;
    };
  }, []);

  // Renvoie true si la connexion réussit
  const connecter = useCallback(async (email, mdp) => {
    try {
      await initDb();
      const user = await verifierConnexion(email, mdp);
      if (!user) return false;
      await ecrireSession(user.id);
      setUtilisateur(user);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, []);

  // Relit l'utilisateur après une modification du profil
  const rafraichir = useCallback(async () => {
    try {
      const session = await lireSession();
      if (session) setUtilisateur(session);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const deconnecter = useCallback(async () => {
    setUtilisateur(null);
    try {
      await effacerSession();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const value = useMemo(
    () => ({
      utilisateur, estConnecte: utilisateur !== null, chargement, connecter, deconnecter, rafraichir,
    }),
    [utilisateur, chargement, connecter, deconnecter, rafraichir]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
};
