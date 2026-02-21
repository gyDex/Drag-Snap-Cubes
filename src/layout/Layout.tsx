
import { PanelControl } from '../components';
import './Layout.scss'

export const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="layout">
        <PanelControl />
        {children}
    </div>
  );
};