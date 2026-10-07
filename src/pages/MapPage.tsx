import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
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

const venues = [
  { id: 1, name: 'Anfiteatro Municipal Humberto de Nito', pos: [-32.9556, -60.6234] as [number, number] },
  { id: 2, name: 'Bioceres Arena (ex Vorterix)', pos: [-32.9379, -60.6698] as [number, number] },
  { id: 3, name: 'Salón Metropolitano', pos: [-32.9248, -60.6722] as [number, number] },
  { id: 4, name: 'Teatro El Círculo', pos: [-32.9526, -60.6359] as [number, number] },
];

function MapPage() {
  const rosarioPosition: [number, number] = [-32.9468, -60.6393]; // UTN FRRO approx

  return (
    <div className="map-page-container">
      <header className="header" style={{ padding: '20px 5%', background: 'var(--bg-dark)', maxWidth: '100%', boxSizing: 'border-box' }}>
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
              ¡Bienvenido a Rosario! <br /> Centro de la ciudad.
            </Popup>
          </Marker>
          {venues.map((venue) => (
            <Marker key={venue.id} position={venue.pos}>
              <Popup>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FaMapMarkerAlt color="var(--violet-electric)" /> <strong>{venue.name}</strong>
                </div>
                <br />
                Punto frecuente de recitales.
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
