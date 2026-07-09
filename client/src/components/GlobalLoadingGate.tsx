import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WiecodesLoadingScreen from './WiecodesLoadingScreen';
import SellerLoadingScreen from './SellerLoadingScreen';
import { useRole } from '@/contexts/RoleContext';

function isWeekendsRoute(pathname: string): boolean {
  return (
    pathname === '/weekends' ||
    pathname.startsWith('/weekends/') ||
    pathname.startsWith('/weekend/')
  );
}

function isSellerRoute(pathname: string): boolean {
  return pathname.startsWith('/seller');
}

interface GlobalLoadingGateProps {
  children: React.ReactNode;
}

const GlobalLoadingGate: React.FC<GlobalLoadingGateProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { isSeller } = useRole();
  // Only on full page load / reload — state resets when the document reloads,
  // but does not re-run on client-side route changes.
  const [showLoader, setShowLoader] = useState(() => !(isWeekendsRoute(pathname) || isSellerRoute(pathname)));

  const handleComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  const isSellerPath = isSellerRoute(pathname) || isSeller;

  return (
    <>
      {children}
      <AnimatePresence>
        {showLoader && (
          isSellerPath ? (
            <SellerLoadingScreen onLoadingComplete={handleComplete} />
          ) : (
            <WiecodesLoadingScreen onLoadingComplete={handleComplete} />
          )
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalLoadingGate;
