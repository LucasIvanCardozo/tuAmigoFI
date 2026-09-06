'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface ModuleSelectionContextValue {
  idModule: string | null;
  setIdModule: (id: string | null) => void;
}

const ModuleSelectionContext = createContext<ModuleSelectionContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  initialIdModule?: string;
}

export const ModuleSelectionProvider = ({ children, initialIdModule }: ProviderProps) => {
  const [idModule, setIdModule] = useState<string | null>(initialIdModule ?? null);

  const handleSetIdModule = useCallback((id: string | null) => setIdModule(id), []);

  const value = useMemo(
    () => ({ idModule, setIdModule: handleSetIdModule }),
    [idModule, handleSetIdModule],
  );

  return (
    <ModuleSelectionContext.Provider value={value}>{children}</ModuleSelectionContext.Provider>
  );
};

export const useModuleSelection = () => {
  const context = useContext(ModuleSelectionContext);
  if (!context) throw new Error('useModuleSelection must be used within ModuleSelectionProvider');
  return context;
};
