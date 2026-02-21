import React, { createContext, useContext, ReactNode } from 'react';

interface CubeActionsContextType {
  explode: () => void;
  isSticking: boolean;
  setSticking: (value: boolean) => void;
}

interface CubeActionsProviderProps {
  children: ReactNode;
  explode: () => void;
  isSticking: boolean;
  setSticking: (value: boolean) => void;
}

const CubeActionsContext = createContext<CubeActionsContextType | undefined>(undefined);

export const CubeActionsProvider: React.FC<CubeActionsProviderProps> = ({
  children,
  explode,
  isSticking,
  setSticking,
}) => (
  <CubeActionsContext.Provider value={{ explode, isSticking, setSticking }}>
    {children}
  </CubeActionsContext.Provider>
);

export const useCubeActions = (): CubeActionsContextType => {
  const context = useContext(CubeActionsContext);
  if (!context) throw new Error('useCubeActions must be used within CubeActionsProvider');
  return context;
};