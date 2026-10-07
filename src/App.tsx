import React from 'react';
import './index.css';

function App() {
  return (
    <div className="landing-container">
      {/* Efectos Sutiles de Fondo */}
      <div className="bg-glow"></div>
      <div className="bg-glow bg-glow-secondary"></div>
      
      <header className="header">
        <h1 className="logo">Concerts Tracker</h1>
        <nav className="nav">
          <a href="#features">Características</a>
          <a href="#about">Acerca de</a>
          <button className="btn-primary">Abrir App</button>
        </nav>
      </header>

      <main className="hero">
        <h2 className="hero-title">Viví la Música.<br/> Mapeá el Viaje.</h2>
        <p className="hero-subtitle">
          Descubrí, seguí y visualizá conciertos en vivo a nivel global. Observá el alcance geográfico de tus artistas favoritos en tiempo real, directo en el mapa.
        </p>
        <div className="cta-group">
          <button className="btn-primary large">Empezar a Explorar</button>
          <button className="btn-secondary large">Ver Documentación</button>
        </div>
      </main>

      <section className="features-grid" id="features">
        <div className="feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Mapeo Global</h3>
          <p>Mapeo espacial interactivo impulsado por OpenStreetMap y Leaflet. Hacé zoom en cualquier ciudad del mundo.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Filtros Dinámicos</h3>
          <p>Filtrá giras por banda, ubicación o área delimitada sin esfuerzo para encontrar exactamente lo que buscás.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Datos en Tiempo Real</h3>
          <p>Consumí APIs en tiempo real para mantenerte al día con los últimos conciertos, disponibilidad de entradas y anuncios de giras.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
