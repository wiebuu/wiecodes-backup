import React, { createContext, useContext, useState, useRef } from "react";

interface SellerInitialLoadContextType {
  isSellerInitialLoad: boolean;
  markSellerInitialLoadComplete: () => void;
}

const SellerInitialLoadContext = createContext<SellerInitialLoadContextType | undefined>(undefined);

export function SellerInitialLoadProvider({ children }: { children: React.ReactNode }) {
  const [isSellerInitialLoad, setIsSellerInitialLoad] = useState(true);
  const hasMarked = useRef(false);

  const markSellerInitialLoadComplete = () => {
    if (!hasMarked.current) {
      setIsSellerInitialLoad(false);
      hasMarked.current = true;
    }
  };

  return (
    <SellerInitialLoadContext.Provider value={{ isSellerInitialLoad, markSellerInitialLoadComplete }}>
      {children}
    </SellerInitialLoadContext.Provider>
  );
}

export function useSellerInitialLoad() {
  const context = useContext(SellerInitialLoadContext);
  if (context === undefined) {
    throw new Error("useSellerInitialLoad must be used within a SellerInitialLoadProvider");
  }
  return context;
}
