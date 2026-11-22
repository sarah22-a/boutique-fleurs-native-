import { AdminScreen } from '../views/screens/AdminScreen';
import { useAdminProduits } from './useAdminProduits';

export const AdminController = ({ onModifie }) => {
  const admin = useAdminProduits({ onModifie });
  return <AdminScreen {...admin} />;
};
