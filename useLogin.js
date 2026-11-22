import { useState, useRef, useEffect } from 'react';
import { validerFormulaireLogin } from '../utils/validation';
import { useAuth } from './AuthContext';

// Contrôleur de la connexion : état du formulaire, validation, appel à AuthContext.
// Il renvoie à la vue des valeurs et des fonctions, rien d'autre.
export const useLogin = () => {
  const { connecter } = useAuth();
  const [form, setForm] = useState({ email: '', mdp: '' });
  const [erreurs, setErreurs] = useState({});
  const [erreurGenerale, setErreurGenerale] = useState(null);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onChange = (champ, valeur) => setForm((f) => ({ ...f, [champ]: valeur }));

  const onSubmit = async () => {
    setErreurGenerale(null);

    const e = validerFormulaireLogin(form);
    setErreurs(e);
    if (Object.keys(e).length > 0) return;

    const ok = await connecter(form.email, form.mdp);
    if (!ok) {
      setErreurGenerale('Email ou mot de passe incorrect');
      onChange('mdp', '');
    }
    // En cas de succès, AuthContext change l'utilisateur et la boutique s'affiche
  };

  return { form, erreurs, erreurGenerale, emailRef, onChange, onSubmit };
};
