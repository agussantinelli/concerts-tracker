import { HashRouter, Routes, Route } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import './index.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>

      {/* Floating GitHub Badge at Bottom Left */}
      <a 
        href="https://github.com/agussantinelli/concerts-tracker"
        target="_blank"
        rel="noopener noreferrer"
        className="github-floating-badge"
        title="Ver repositorio en GitHub"
        aria-label="Ver repositorio de Concerts Tracker en GitHub"
      >
        <FaGithub size={18} />
        <span>GitHub</span>
        <FaExternalLinkAlt size={9} className="github-external-icon" />
      </a>
    </HashRouter>
  );
}

export default App;
