
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface HelpContextType {
  isHelpOpen: boolean;
  setHelpOpen: (isOpen: boolean) => void;
  toggleHelp: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider = ({ children }: { children: ReactNode }) => {
  const [isHelpOpen, setHelpOpen] = useState(false);

  const toggleHelp = useCallback(() => {
    setHelpOpen(prev => !prev);
  }, []);

  return (
    <HelpContext.Provider value={{ isHelpOpen, setHelpOpen, toggleHelp }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};
