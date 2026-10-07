import React from 'react';
import './index.css';

function App() {
  return (
    <div className="landing-container">
      {/* Subtle Background Effects */}
      <div className="bg-glow"></div>
      <div className="bg-glow bg-glow-secondary"></div>
      
      <header className="header">
        <h1 className="logo">Concerts Tracker</h1>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <button className="btn-primary">Launch App</button>
        </nav>
      </header>

      <main className="hero">
        <h2 className="hero-title">Experience Music.<br/> Map the Journey.</h2>
        <p className="hero-subtitle">
          Discover, track, and visualize live concerts globally. See the geographical reach of your favorite artists in real-time, right on the map.
        </p>
        <div className="cta-group">
          <button className="btn-primary large">Start Exploring</button>
          <button className="btn-secondary large">View Documentation</button>
        </div>
      </main>

      <section className="features-grid" id="features">
        <div className="feature-card">
          <div className="feature-icon">🗺️</div>
          <h3>Global Mapping</h3>
          <p>Interactive spatial mapping powered by OpenStreetMap & Leaflet. Zoom into any city in the world.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Dynamic Filters</h3>
          <p>Filter tours by band, location, or bounding box effortlessly to find exactly what you are looking for.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-time Data</h3>
          <p>Consume live APIs to stay updated on the latest concerts, ticket availability and tour announcements.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
