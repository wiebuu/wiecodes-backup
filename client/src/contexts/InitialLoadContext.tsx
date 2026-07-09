import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface InitialLoadContextType {
  isInitialLoad: boolean;
  markInitialLoadComplete: () => void;
}

const InitialLoadContext = createContext<InitialLoadContextType | undefined>(undefined);

export function InitialLoadProvider({ children }: { children: React.ReactNode }) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasMarked = useRef(false);

  const markInitialLoadComplete = () => {
    if (!hasMarked.current) {
      setIsInitialLoad(false);
      hasMarked.current = true;
    }
  };

  return (
    <InitialLoadContext.Provider value={{ isInitialLoad, markInitialLoadComplete }}>
      {children}
    </InitialLoadContext.Provider>
  );
}

export function useInitialLoad() {
  const context = useContext(InitialLoadContext);
  if (context === undefined) {
    throw new Error("useInitialLoad must be used within an InitialLoadProvider");
  }
  return context;
}
