import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { roleAtom } from '@/model/atoms';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [roles] = useAtom(roleAtom);

  // Check if the user has the admin role
  const isAdmin = roles.includes('admin');

  if (!isAdmin) {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  // Render children if user is admin
  return <>{children}</>;
};

export default AdminRoute;
