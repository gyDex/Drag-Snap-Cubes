import React, { createContext, useContext, ReactNode, useState } from 'react';

interface CubeColorContextType {
  setColorCube: (color: string) => void;
  setBorderCube: (color: string) => void;
  borderCube: string;
  colorCube: string;
}

interface CubeColorProviderProps {
  children: ReactNode;
}

const CubeColorContext = createContext<CubeColorContextType | undefined>(undefined);

export const CubeColorProvider: React.FC<CubeColorProviderProps> = ({
  children
}) => {
    const [colorCube, setColorCube] = useState('');
    const [borderCube, setBorderCube] = useState('');

    return (
        <CubeColorContext.Provider value={{ colorCube, setColorCube, setBorderCube, borderCube  }}>
            {children}
        </CubeColorContext.Provider>    
    )
}

export const useCubeColor = (): CubeColorContextType => {
  const context = useContext(CubeColorContext);
  if (!context) throw new Error('useCubeColor must be used within CubeColorProvider');
  return context;
};