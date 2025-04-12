import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { roleAtom } from '@/model/atoms';

interface ManagerRouteProps {
  children: React.ReactNode;
}

const ManagerRoute = ({ children }: ManagerRouteProps) => {
  const [roles] = useAtom(roleAtom);

  // Check if the user has either manager or admin role
  const hasAccess = roles.some(role => ['admin', 'manager'].includes(role));

  if (!hasAccess) {
    // Redirect to home if not a manager or admin
    return <Navigate to="/" replace />;
  }

  // Render children if user has access
  return <>{children}</>;
};

export default ManagerRoute;
