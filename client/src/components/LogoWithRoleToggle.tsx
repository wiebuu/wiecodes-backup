import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useScrollToTop from '@/hooks/useScrollToTop';

const LogoWithRoleToggle = () => {
  useScrollToTop();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname === '/' || location.pathname === '/seller') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative flex items-center flex-shrink-0">
      {/* Logo */}
      <motion.button
        onClick={handleLogoClick}
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="focus:outline-none"
      >
        <motion.img
          src="/wiecodes-preview2.png"
          alt="WIECODES"
          className="h-24 w-auto object-contain -ml-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        />
      </motion.button>
    </div>
  );
};

export default LogoWithRoleToggle;
