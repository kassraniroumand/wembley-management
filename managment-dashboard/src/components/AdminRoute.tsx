import { Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { roleAtom } from '@/model/atoms';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [roles] = useAtom(roleAtom);
  console.log("AdminRoute roles:", roles);

  // Check if roles is defined and has values
  if (!roles || roles.length === 0) {
    console.warn("No roles found, access denied");
    return <Navigate to="/dashboard" replace />;
  }

  // Convert roles to lowercase for case-insensitive comparison
  const normalizedRoles = roles.map(role => role.toLowerCase());
  console.log("Normalized roles:", normalizedRoles);

  // Check if the user has the admin role (case-insensitive)
  const isAdmin = normalizedRoles.includes('admin');
  console.log("Is admin?", isAdmin);

  if (!isAdmin) {
    console.warn("User is not an admin, redirecting to dashboard");
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if user is admin
  console.log("Admin access granted");
  return <>{children}</>;
};

export default AdminRoute;
