import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
      {/* Efectos Sutiles de Fondo */}
      <div className="bg-glow"></div>
      <div className="bg-glow bg-glow-secondary"></div>
      
      <main className="hero" style={{ marginTop: 0 }}>
        <h2 className="hero-title">Viví la Música.<br/> Mapeá el Viaje.</h2>
        <p className="hero-subtitle">
          Descubrí, seguí y visualizá conciertos en vivo a nivel global. Observá el alcance geográfico de tus artistas favoritos en tiempo real, directo en el mapa.
        </p>
        <div className="cta-group" style={{ justifyContent: 'center' }}>
          <Link to="/map">
            <button className="btn-primary large" style={{ fontSize: '1.2rem', padding: '15px 40px' }}>Explorar</button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
