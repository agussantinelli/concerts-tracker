import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapPage() {
  const rosarioPosition: [number, number] = [-32.9468, -60.6393]; // UTN FRRO approx

  return (
    <div className="map-page-container">
      <header className="header" style={{ padding: '20px 5%', background: 'var(--bg-dark)', maxWidth: '100%' }}>
        <h1 className="logo" style={{ fontSize: '1.2rem' }}>Concerts Tracker - Mapa</h1>
        <nav className="nav">
          <Link to="/">
            <button className="btn-secondary">Volver al Inicio</button>
          </Link>
        </nav>
      </header>
      
      <div className="map-wrapper" style={{ height: 'calc(100vh - 80px)', width: '100%', position: 'relative', zIndex: 0 }}>
        <MapContainer center={rosarioPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={rosarioPosition}>
            <Popup>
              ¡Bienvenido a Rosario! <br /> Cuna del Rock Nacional.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
