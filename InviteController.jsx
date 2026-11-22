import { useState } from 'react';
import { InviteLayout } from '../views/layouts/InviteLayout';
import { LoginController } from './LoginController';
import { InscriptionController } from './InscriptionController';

// Utilisateur non connecté : bascule entre connexion et inscription
export const InviteController = () => {
  const [ecran, setEcran] = useState('login');

  return (
    <InviteLayout
      ecran={ecran}
      onBasculer={() => setEcran(ecran === 'login' ? 'inscription' : 'login')}
    >
      {ecran === 'login'
        ? <LoginController />
        : <InscriptionController onInscrit={() => setEcran('login')} />}
    </InviteLayout>
  );
};
