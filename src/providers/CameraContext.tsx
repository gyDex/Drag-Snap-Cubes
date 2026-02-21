import React, { createContext, useContext, ReactNode, useState } from 'react';

interface CameraContextType {
  space: '3D' | '2D';
  setSpace: (value: '3D' | '2D') => void;
}

interface CameraProviderProps {
  children: ReactNode;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<CameraProviderProps> = ({
  children,
}) => {
    const [space, setSpace] = useState<'3D' | '2D'>('3D');

    return (
        <CameraContext.Provider value={{ setSpace, space }}>
            {children}
        </CameraContext.Provider>
    )
};

export const useCamera = (): CameraContextType => {
  const context = useContext(CameraContext);
  if (!context) throw new Error('useCamera must be used within CameraProvider');
  return context;
};