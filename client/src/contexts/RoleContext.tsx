import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

type Role = 'buyer' | 'seller' | 'admin' | 'reviewer';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isSeller: boolean;
  isBuyer: boolean;
  isAdmin: boolean;
  checkingRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [role, setRoleState] = useState<Role>('buyer');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const fetchUserRole = async () => {
      setCheckingRole(true);
      if (!token) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userRole = res.data?.role;
        setIsAdmin(userRole === 'admin');

        if (userRole === 'seller') {
          setRoleState('seller');
        } else if (userRole === 'buyer') {
          setRoleState('buyer');
        } else if (userRole === 'admin') {
          setRoleState('buyer'); // Admins still browse as buyer unless in /admin
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    fetchUserRole();
  }, [token]);

  useEffect(() => {
    // Update role based on current route
    if (isSellerRoute && role === 'buyer') {
      setRoleState('seller');
    } else if (!isSellerRoute && role === 'seller') {
      setRoleState('buyer');
    }
  }, [location.pathname]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'seller' && !isSellerRoute) {
      navigate('/seller');
    } else if (newRole === 'buyer' && isSellerRoute) {
      navigate('/');
    }
  };

  const value: RoleContextType = {
    role,
    setRole,
    isSeller: isSellerRoute || role === 'seller',
    isBuyer: !isSellerRoute && role === 'buyer',
    isAdmin,
    checkingRole,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};
