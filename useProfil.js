import { useState, useEffect } from 'react';
import { initDb, modifierProfil, listerFavoris } from '../models';
import { useAuth } from './AuthContext';
import { validerFormulaireProfil } from '../utils/validation';

// Contrôleur du profil : modification du nom, du prénom et du téléphone, nombre de favoris.
export const useProfil = ({ actif } = {}) => {
  const { utilisateur, rafraichir, deconnecter } = useAuth();
  const [form, setForm] = useState({ prenom: '', nom: '', telephone: '' });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({ favoris: 0 });

  // À chaque affichage de l'onglet : formulaire remis aux valeurs du compte, statistiques relues
  useEffect(() => {
    if (!actif) return undefined;
    let courant = true;
    setForm({
      prenom: utilisateur.prenom, nom: utilisateur.nom, telephone: utilisateur.telephone ?? '',
    });
    setErreurs({});
    setMessage(null);
    initDb()
      .then(() => listerFavoris(utilisateur.id))
      .then((favoris) => {
        if (courant) setStats({ favoris: favoris.length });
      })
      .catch(console.log);
    return () => {
      courant = false;
    };
    // utilisateur est volontairement absent : on ne réécrit pas la saisie pendant qu'on la modifie
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif]);

  const onChange = (champ, valeur) => {
    setForm((f) => ({ ...f, [champ]: valeur }));
    setErreurs((e) => ({ ...e, [champ]: undefined }));
    setMessage(null);
  };

  const onEnregistrer = async () => {
    const e = validerFormulaireProfil(form);
    setErreurs(e);
    if (Object.keys(e).length > 0) return;
    try {
      await modifierProfil(utilisateur.id, form);
      await rafraichir();
      setMessage('Profil enregistré');
    } catch (err) {
      console.log(err);
      setErreurs({ general: "Impossible d'enregistrer le profil" });
    }
  };

  return { utilisateur, form, erreurs, message, stats, onChange, onEnregistrer, onDeconnexion: deconnecter };
};
