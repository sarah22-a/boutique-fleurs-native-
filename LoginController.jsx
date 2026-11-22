import { LoginScreen } from '../views/screens/LoginScreen';
import { useLogin } from './useLogin';

// Contrôleur : relie le hook (logique) à la vue (affichage) par des props
export const LoginController = () => {
  const login = useLogin();
  return <LoginScreen {...login} />;
};
