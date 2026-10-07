import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt, FaCalendarAlt, FaMusic, FaTicketAlt, FaFilter } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

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

// Hardcoded Data
const venues = [
  { id: 1, name: 'Anfiteatro Municipal Humberto de Nito', pos: [-32.9556, -60.6234] as [number, number] },
  { id: 2, name: 'Bioceres Arena (ex Vorterix)', pos: [-32.9379, -60.6698] as [number, number] },
  { id: 3, name: 'Salón Metropolitano', pos: [-32.9248, -60.6722] as [number, number] },
  { id: 4, name: 'Teatro El Círculo', pos: [-32.9526, -60.6359] as [number, number] },
];

const mockEvents = [
  // Anfiteatro Municipal
  { id: 101, artist: 'Ciro y los Persas', date: '2026-11-06', venueId: 1, genre: 'Rock Nacional' },
  { id: 102, artist: 'Abel Pintos', date: '2026-11-28', venueId: 1, genre: 'Pop / Folclore' },
  { id: 103, artist: 'Serú Girán (Homenaje)', date: '2026-12-07', venueId: 1, genre: 'Rock Nacional' },
  { id: 104, artist: 'Babasónicos', date: '2026-12-11', venueId: 1, genre: 'Rock Alternativo' },
  { id: 105, artist: 'La K\'onga', date: '2027-02-13', venueId: 1, genre: 'Cuarteto' },

  // Bioceres Arena (ex Vorterix)
  { id: 106, artist: 'Angela Torres', date: '2026-10-23', venueId: 2, genre: 'Pop' },
  { id: 107, artist: 'Sergio Dalma', date: '2026-10-30', venueId: 2, genre: 'Balada / Pop' },
  { id: 108, artist: 'Ke Personajes', date: '2026-10-31', venueId: 2, genre: 'Cumbia' },
  { id: 109, artist: 'Alex Ubago', date: '2026-11-14', venueId: 2, genre: 'Pop Romántico' },

  // Salón Metropolitano
  { id: 110, artist: 'CamelPhat', date: '2026-10-09', venueId: 3, genre: 'Electrónica' },
  { id: 111, artist: 'Los Pericos', date: '2026-10-17', venueId: 3, genre: 'Reggae' },
  { id: 112, artist: 'David Bisbal', date: '2026-10-18', venueId: 3, genre: 'Pop Latino' },
  { id: 113, artist: 'Camilo', date: '2026-10-30', venueId: 3, genre: 'Pop Latino' },
  { id: 114, artist: 'Ha*Ash', date: '2027-03-12', venueId: 3, genre: 'Pop / Country' },
  { id: 115, artist: 'Nonpalidece', date: '2027-03-26', venueId: 3, genre: 'Reggae' },

  // Teatro El Círculo
  { id: 116, artist: 'Dyango', date: '2026-10-16', venueId: 4, genre: 'Romántico' },
  { id: 117, artist: 'Pedro Aznar', date: '2026-11-15', venueId: 4, genre: 'Rock / Fusión' },
  { id: 118, artist: 'Sergio Torres', date: '2027-04-18', venueId: 4, genre: 'Cumbia Santafesina' },
];

function MapPage() {
  const rosarioPosition: [number, number] = [-32.9468, -60.6393];

  const [artistFilter, setArtistFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('ALL');

  // Filter events based on criteria
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchArtist = event.artist.toLowerCase().includes(artistFilter.toLowerCase());
      const matchVenue = venueFilter === 'ALL' || event.venueId.toString() === venueFilter;
      return matchArtist && matchVenue;
    });
  }, [artistFilter, venueFilter]);

  // Derive which venues to show on the map (only venues that have matching events)
  const activeVenues = useMemo(() => {
    const activeIds = new Set(filteredEvents.map(e => e.venueId));
    return venues.filter(v => activeIds.has(v.id));
  }, [filteredEvents]);

  return (
    <div className="map-page-container">
      <header className="header" style={{ padding: '20px 5%', background: 'var(--bg-dark)', maxWidth: '100%', boxSizing: 'border-box' }}>
        <h1 className="logo" style={{ fontSize: '1.2rem' }}>Concerts Tracker - Mapa interactivo</h1>
        <nav className="nav">
          <Link to="/">
            <button className="btn-secondary">Volver al Inicio</button>
          </Link>
        </nav>
      </header>
      
      <div className="map-page-layout">
        
        {/* Sidebar UI for Filters and List */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2><FaFilter size={18} style={{ marginRight: '8px' }}/> Filtros</h2>
            <div className="filter-group">
              <input 
                type="text" 
                className="filter-input" 
                placeholder="Buscar por artista..." 
                value={artistFilter}
                onChange={(e) => setArtistFilter(e.target.value)}
              />
              <select 
                className="filter-select"
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
              >
                <option value="ALL">Todos los Recintos</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sidebar-content">
            {filteredEvents.length === 0 ? (
              <div className="no-results">
                No se encontraron recitales con esos filtros.
              </div>
            ) : (
              filteredEvents.map(event => {
                const venue = venues.find(v => v.id === event.venueId);
                return (
                  <div key={event.id} className="event-card">
                    <h3 className="event-artist">{event.artist}</h3>
                    <div className="event-details">
                      <div className="event-details-row">
                        <FaMapMarkerAlt color="var(--violet-electric)" /> {venue?.name}
                      </div>
                      <div className="event-details-row">
                        <FaCalendarAlt color="var(--violet-electric)" /> {new Date(event.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="event-details-row">
                        <FaMusic color="var(--violet-electric)" /> {event.genre}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Leaflet Map */}
        <div className="map-container-wrapper">
          <MapContainer center={rosarioPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {activeVenues.map((venue) => {
              // Find events for this specific venue
              const venueEvents = filteredEvents.filter(e => e.venueId === venue.id);
              
              return (
                <Marker key={venue.id} position={venue.pos}>
                  <Popup className="custom-popup">
                    <div className="popup-venue-name">
                      <FaMapMarkerAlt /> {venue.name}
                    </div>
                    {venueEvents.map(ev => (
                      <div key={ev.id} className="popup-event-item">
                        <div className="popup-event-artist">{ev.artist}</div>
                        <div className="popup-event-date">{new Date(ev.date).toLocaleDateString('es-AR')} - {ev.genre}</div>
                      </div>
                    ))}
                    <button className="btn-primary" style={{ width: '100%', marginTop: '10px', padding: '6px', fontSize: '0.9rem' }}>
                      <FaTicketAlt style={{ marginRight: '5px' }}/> Ver Entradas
                    </button>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
