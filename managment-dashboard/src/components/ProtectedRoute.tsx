import { Navigate, Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authAtom } from '@/model/atoms';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const [auth] = useAtom(authAtom);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // This ensures we wait for Jotai to hydrate from localStorage
    setIsReady(true);
  }, []);

  // Don't render anything during initial load
  if (!isReady) {
    return null;
  }

  // After initial hydration, check authentication
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
