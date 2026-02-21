import React, { useState, useRef } from 'react';
import './styles/main.scss'
import { Layout } from './layout/Layout';
import { CubeActionsProvider } from './providers/CubeActionsContext';
import { Scene } from './Scene';
import { PanelControl } from './components/PanelControl/PanelControl';
import { CubeColorProvider } from './providers/CubeColorContext';
import { CameraProvider } from './providers/CameraContext';

const App: React.FC = () => {
  const [isSticking, setSticking] = useState(false);
  const explodeRef = useRef<() => void>(() => {}); // вот он! хранит актуальный explode

  return (
    <CubeActionsProvider
      explode={() => explodeRef.current?.()}
      isSticking={isSticking}
      setSticking={setSticking}
    >
      <CameraProvider>
        <CubeColorProvider>
          <Layout>
            <Scene explodeRef={explodeRef} />
            <PanelControl />
          </Layout>
        </CubeColorProvider>
      </CameraProvider>
    </CubeActionsProvider>
  );
};

export default App;