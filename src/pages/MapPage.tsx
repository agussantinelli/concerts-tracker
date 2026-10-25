import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaMusic, 
  FaTicketAlt, 
  FaFilter, 
  FaBroadcastTower, 
  FaSortAmountDownAlt,
  FaExternalLinkAlt,
  FaChevronDown,
  FaCheck,
  FaTimes,
  FaEye,
  FaSearch,
  FaHome
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import { Venue, ConcertEvent } from '../types';
import { fetchLiveVenues, fetchLiveEvents } from '../services/concertsService';

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

// Controlador de cámara de Leaflet para centrar y animar fluidamente el mapa al seleccionar
function MapController({ 
  targetPos, 
  zoom 
}: { 
  targetPos: [number, number]; 
  zoom: number;
}) {
  const map = useMap();
  const [lat, lon] = targetPos;

  useEffect(() => {
    map.flyTo([lat, lon], zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [map, lat, lon, zoom]);

  return null;
}

function MapPage() {
  const rosarioPosition: [number, number] = [-32.9468, -60.6393];

  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<ConcertEvent[]>([]);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loading, setLoading] = useState(true);

  const [artistFilter, setArtistFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string | number | null>(null);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  // Fecha actual (formato YYYY-MM-DD) para filtrar siempre conciertos a partir de hoy
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVenueDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedVenue = useMemo(() => {
    return venues.find(v => v.id.toString() === venueFilter);
  }, [venues, venueFilter]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find(e => e.id.toString() === selectedEventId.toString()) || null;
  }, [events, selectedEventId]);

  const selectedEventVenue = useMemo(() => {
    if (!selectedEvent) return null;
    return venues.find(v => v.id.toString() === selectedEvent.venueId.toString()) || null;
  }, [venues, selectedEvent]);

  useEffect(() => {
    let isMounted = true;

    async function loadDataFromApis() {
      setLoading(true);
      try {
        // 1. Obtener recintos oficiales en tiempo real desde OpenStreetMap Nominatim (0% hardcoding)
        const venuesResult = await fetchLiveVenues();
        
        // 2. Obtener eventos en tiempo real desde Bandsintown Live API unificados a recintos de OSM
        const eventsResult = await fetchLiveEvents(venuesResult.venues);

        if (isMounted) {
          setVenues(venuesResult.venues);
          setEvents(eventsResult.events);
          setIsLiveApi(venuesResult.isLive);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error cargando fuentes de información espacial en tiempo real:', err);
        if (isMounted) setLoading(false);
      }
    }

    void loadDataFromApis();
    return () => { isMounted = false; };
  }, []);

  // Validación y filtrado reactivo de eventos:
  // 1. Muestra SIEMPRE y ÚNICAMENTE recitales en el día de la fecha o posteriores
  // 2. Ordena automáticamente en orden cronológico ascendente (el más próximo primero)
  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        // Validación estricta: sólo fechas posteriores o iguales a hoy
        if (!event.date || event.date < today) {
          return false;
        }

        const matchArtist = event.artist.toLowerCase().includes(artistFilter.toLowerCase());
        const matchVenue = venueFilter === 'ALL' || event.venueId.toString() === venueFilter;
        return matchArtist && matchVenue;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, artistFilter, venueFilter, today]);

  // Si el concierto seleccionado deja de estar en la lista filtrada, deseleccionar automáticamente
  useEffect(() => {
    if (selectedEventId && !filteredEvents.some(e => e.id.toString() === selectedEventId.toString())) {
      setSelectedEventId(null);
    }
  }, [filteredEvents, selectedEventId]);

  // Abrir automáticamente el popup del marcador seleccionado
  useEffect(() => {
    if (selectedEventId && markerRef.current) {
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedEventId]);

  // Derivar qué recintos mostrar en la cartografía
  const activeVenues = useMemo(() => {
    // Si el usuario seleccionó un concierto específico en la barra lateral, marcar ÚNICAMENTE ese recinto
    if (selectedEventVenue) {
      return [selectedEventVenue];
    }
    // Si seleccionó un recinto desde el menú desplegable
    if (venueFilter !== 'ALL') {
      return venues.filter(v => v.id.toString() === venueFilter);
    }
    // Si el usuario filtró por artista, mostrar solo los recintos donde toca
    if (artistFilter.trim()) {
      const activeIds = new Set(filteredEvents.map(e => e.venueId.toString()));
      return venues.filter(v => activeIds.has(v.id.toString()));
    }
    // Si no hay filtro de artista ni selección individual, mostrar todos los escenarios
    return venues;
  }, [venues, filteredEvents, venueFilter, artistFilter, selectedEventVenue]);

  // Calcular la posición y nivel de zoom hacia donde debe animar el mapa
  const { targetPos, targetZoom } = useMemo(() => {
    if (selectedEventVenue) {
      return { targetPos: selectedEventVenue.pos, targetZoom: 15 };
    }
    if (selectedVenue) {
      return { targetPos: selectedVenue.pos, targetZoom: 15 };
    }
    return { targetPos: rosarioPosition, targetZoom: 13 };
  }, [selectedEventVenue, selectedVenue, rosarioPosition]);

  return (
    <div className="map-page-container">
      <header className="header" style={{ padding: '20px 5%', background: 'var(--bg-dark)', maxWidth: '100%', boxSizing: 'border-box' }}>
        <h1 className="logo" style={{ fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FaMusic size={15} color="var(--violet-light)" /> Concerts Tracker - Mapa interactivo
        </h1>
        <nav className="nav">
          <Link to="/">
            <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FaHome size={12} /> Volver al Inicio
            </button>
          </Link>
        </nav>
      </header>
      
      <div className="map-page-layout">
        
        {/* Sidebar UI for Filters and List */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2><FaFilter size={18} style={{ marginRight: '8px' }}/> Filtros</h2>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FaSortAmountDownAlt size={12} /> Cronológico
              </span>
            </div>
            
            {/* Indicador de estado de las múltiples APIs en tiempo real */}
            <div className="api-badge" title="Geoservicios y eventos conectados en tiempo real">
              <span className="api-badge-dot" style={{ backgroundColor: isLiveApi ? '#22c55e' : '#f59e0b' }}></span>
              <FaBroadcastTower size={12} />
              <span>
                {isLiveApi ? 'APIs en Vivo: OpenStreetMap + Bandsintown' : 'Conectando con APIs...'}
              </span>
            </div>

            <div className="filter-group" style={{ marginTop: '14px' }}>
              <div className="search-input-wrapper">
                <FaSearch className="search-input-icon" size={13} />
                <input 
                  type="text" 
                  className="filter-input with-search-icon" 
                  placeholder="Buscar por artista..." 
                  value={artistFilter}
                  onChange={(e) => setArtistFilter(e.target.value)}
                />
              </div>
              {/* Dropdown Personalizado con Glassmorphism */}
              <div className="custom-select-wrapper" ref={dropdownRef}>
                <button 
                  type="button"
                  className={`custom-select-trigger ${isVenueDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <FaMapMarkerAlt size={13} color="var(--violet-light)" style={{ flexShrink: 0 }} />
                    <span className="selected-venue-label">
                      {selectedVenue ? selectedVenue.name : `Todos los Recintos (${venues.length})`}
                    </span>
                  </div>
                  <FaChevronDown size={11} className={`select-arrow ${isVenueDropdownOpen ? 'rotated' : ''}`} />
                </button>

                {isVenueDropdownOpen && (
                  <div className="custom-select-options">
                    <button 
                      type="button"
                      className={`custom-select-option ${venueFilter === 'ALL' && !selectedEventId ? 'active' : ''}`}
                      onClick={() => {
                        setVenueFilter('ALL');
                        setSelectedEventId(null);
                        setIsVenueDropdownOpen(false);
                      }}
                    >
                      <span style={{ fontWeight: venueFilter === 'ALL' ? 600 : 400 }}>Todos los Recintos</span>
                      <span className="option-count">({venues.length})</span>
                    </button>

                    {venues.map(v => (
                      <button 
                        type="button"
                        key={v.id}
                        className={`custom-select-option ${venueFilter === v.id.toString() ? 'active' : ''}`}
                        onClick={() => {
                          setVenueFilter(v.id.toString());
                          setSelectedEventId(null);
                          setIsVenueDropdownOpen(false);
                        }}
                      >
                        <div className="option-name-wrapper">
                          <span className="option-name">{v.name}</span>
                          {v.type && <span className="option-type-tag">{v.type}</span>}
                        </div>
                        {venueFilter === v.id.toString() && <FaCheck size={11} color="var(--violet-light)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Banner reactivo cuando un concierto está seleccionado y marcado individualmente */}
            {selectedEvent && (
              <div className="active-selection-bar">
                <div className="selection-info">
                  <FaMapMarkerAlt size={12} color="var(--violet-light)" style={{ flexShrink: 0 }} />
                  <span className="selection-info-text">
                    Marcado: <strong>{selectedEvent.artist}</strong> ({selectedEventVenue?.name})
                  </span>
                </div>
                <button 
                  type="button" 
                  className="btn-clear-selection"
                  onClick={() => setSelectedEventId(null)}
                  title="Mostrar todos los recintos en el mapa"
                >
                  <FaTimes size={10} /> Ver todos
                </button>
              </div>
            )}

            {/* Contador de resultados */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              Mostrando {filteredEvents.length} recitales próximos en vivo
            </div>
          </div>

          <div className="sidebar-content">
            {(() => {
              if (loading) {
                return (
                  <div className="no-results">
                    Consultando APIs en tiempo real (Bandsintown, MusicBrainz & OpenStreetMap)...
                  </div>
                );
              }
              if (filteredEvents.length === 0) {
                return (
                  <div className="no-results">
                    <p>No se encontraron conciertos programados a partir del día de la fecha.</p>
                  </div>
                );
              }
              return filteredEvents.map(event => {
                const venue = venues.find(v => v.id.toString() === event.venueId.toString());
                const isBandsintown = event.source === 'Bandsintown';
                const isSelected = selectedEventId !== null && event.id.toString() === selectedEventId.toString();

                return (
                  <div 
                    key={event.id} 
                    className={`event-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedEventId(isSelected ? null : event.id);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedEventId(isSelected ? null : event.id);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {venue?.type && (
                          <span className="venue-tag">{venue.type}</span>
                        )}
                        {isSelected && (
                          <span className="card-selected-badge">
                            <FaCheck size={9} /> Marcado en el mapa
                          </span>
                        )}
                      </div>
                      <span className={`source-badge ${isBandsintown ? 'bandsintown' : 'musicbrainz'}`}>
                        {event.source || 'API'}
                      </span>
                    </div>

                    <h3 className="event-artist">{event.artist}</h3>

                    <div className="event-details">
                      <div className="event-details-row venue-row">
                        <FaMapMarkerAlt color="var(--violet-electric)" /> 
                        <span className="venue-name-highlight">{venue?.name || event.venueName || 'Recinto'}</span>
                      </div>
                      <div className="event-details-row">
                        <FaCalendarAlt color="var(--violet-electric)" /> {event.date ? new Date(event.date + 'T00:00:00').toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha a confirmar'}
                      </div>
                      <div className="event-details-row">
                        <FaMusic color="var(--violet-electric)" /> {event.genre}
                      </div>
                    </div>

                    <div className="card-actions-row">
                      {event.ticketUrl && (
                        <a 
                          href={event.ticketUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="ticket-link-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaTicketAlt size={10} /> Entradas oficiales <FaExternalLinkAlt size={8} />
                        </a>
                      )}

                      <button 
                        type="button"
                        className={`card-locate-btn ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEventId(isSelected ? null : event.id);
                        }}
                        title={isSelected ? 'Desmarcar del mapa' : 'Marcar únicamente este concierto en el mapa'}
                      >
                        <FaEye size={11} /> {isSelected ? 'Desmarcar' : 'Ver en mapa'}
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </aside>

        {/* Leaflet Map */}
        <div className="map-container-wrapper">
          {/* Badge flotante sobre el mapa indicando que se está marcando un recital específico */}
          {selectedEvent && selectedEventVenue && (
            <div className="map-overlay-badge">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaMapMarkerAlt size={12} color="var(--violet-light)" />
                <span>Mostrando únicamente: <strong>{selectedEventVenue.name}</strong> ({selectedEvent.artist})</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedEventId(null)} 
                className="map-overlay-reset-btn"
                title="Volver a mostrar todos los recintos"
              >
                <FaTimes size={10} /> Ver todos los recintos
              </button>
            </div>
          )}

          <MapContainer center={rosarioPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Controlador reactivo para animar la vista al seleccionar recitales */}
            <MapController targetPos={targetPos} zoom={targetZoom} />
            
            {activeVenues.map((venue) => {
              // Encuentra eventos para este recinto específico, ordenados por fecha
              const venueEvents = filteredEvents
                .filter(e => e.venueId.toString() === venue.id.toString())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              
              const isSelectedVenue = selectedEventVenue?.id.toString() === venue.id.toString();

              return (
                <Marker 
                  key={venue.id} 
                  position={venue.pos}
                  ref={isSelectedVenue ? (ref) => { markerRef.current = ref; } : undefined}
                >
                  <Popup className="custom-popup">
                    <div className="popup-venue-name">
                      <FaMapMarkerAlt style={{ marginRight: '6px' }} /> {venue.name}
                    </div>
                    {venue.type && (
                      <div style={{ marginBottom: '4px' }}>
                        <span className="venue-tag">{venue.type}</span>
                        <span className="source-badge bandsintown" style={{ marginLeft: '4px' }}>
                          OpenStreetMap
                        </span>
                      </div>
                    )}
                    {venue.address && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        <FaMapMarkerAlt size={11} style={{ marginRight: '4px', verticalAlign: 'middle', color: 'var(--violet-light)' }} /> {venue.address}
                      </div>
                    )}
                    {venueEvents.length > 0 ? (
                      venueEvents.map(ev => {
                        const isThisConcertSelected = selectedEventId !== null && ev.id.toString() === selectedEventId.toString();
                        return (
                          <div 
                            key={ev.id} 
                            className={`popup-event-item ${isThisConcertSelected ? 'popup-event-selected' : ''}`}
                          >
                            {isThisConcertSelected && (
                              <div className="selected-tag-pill">
                                <FaCheck size={9} /> Concierto seleccionado
                              </div>
                            )}
                            <div className="popup-event-artist">{ev.artist}</div>
                            <div className="popup-event-date">
                              {ev.date ? new Date(ev.date + 'T00:00:00').toLocaleDateString('es-AR') : ''} - {ev.genre}
                            </div>
                            {ev.ticketUrl && (
                              <a 
                                href={ev.ticketUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="ticket-link-btn"
                                style={{ marginTop: '4px', display: 'inline-flex' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaTicketAlt size={10} /> Entradas <FaExternalLinkAlt size={8} />
                              </a>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Recinto oficial obtenido en tiempo real desde OpenStreetMap.
                      </div>
                    )}
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
