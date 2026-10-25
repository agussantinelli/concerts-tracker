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
  FaHome,
  FaSyncAlt
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import { Venue, ConcertEvent } from '../types';
import { fetchLiveVenues, fetchLiveEvents, translateVenueType } from '../services/concertsService';

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

function filterConcertEvents(
  events: ConcertEvent[],
  artistFilter: string,
  venueFilter: string,
  today: string
): ConcertEvent[] {
  const lowerArtist = artistFilter.toLowerCase();
  return events
    .filter(event => {
      if (!event.date || event.date < today) return false;
      const matchArtist = event.artist.toLowerCase().includes(lowerArtist);
      const matchVenue = venueFilter === 'ALL' || event.venueId.toString() === venueFilter;
      return matchArtist && matchVenue;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function resolveActiveVenues(
  selectedEventVenue: Venue | null,
  venueFilter: string,
  artistFilter: string,
  venues: Venue[],
  filteredEvents: ConcertEvent[]
): Venue[] {
  if (selectedEventVenue) return [selectedEventVenue];
  if (venueFilter !== 'ALL') return venues.filter(v => v.id.toString() === venueFilter);
  if (artistFilter.trim()) {
    const activeIds = new Set(filteredEvents.map(e => e.venueId.toString()));
    return venues.filter(v => activeIds.has(v.id.toString()));
  }
  return venues;
}

function resolveMapTarget(
  selectedEventVenue: Venue | null,
  selectedVenue: Venue | null,
  rosarioPosition: [number, number]
): { targetPos: [number, number]; targetZoom: number } {
  const activeFocus = selectedEventVenue || selectedVenue;
  if (activeFocus) {
    const [vLat, vLon] = activeFocus.pos;
    return { targetPos: [vLat + 0.0065, vLon], targetZoom: 15 };
  }
  return { targetPos: rosarioPosition, targetZoom: 13 };
}

function MapPage() {
  const rosarioPosition: [number, number] = [-32.9468, -60.6393];

  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<ConcertEvent[]>([]);
  const [apiStatus, setApiStatus] = useState<'CONNECTING' | 'LIVE' | 'ERROR'>('CONNECTING');
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
    return venues.find(v => v.id.toString() === venueFilter) || null;
  }, [venues, venueFilter]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find(e => e.id.toString() === selectedEventId.toString()) || null;
  }, [events, selectedEventId]);

  const selectedEventVenue = useMemo(() => {
    if (!selectedEvent) return null;
    return venues.find(v => v.id.toString() === selectedEvent.venueId.toString()) || null;
  }, [venues, selectedEvent]);

  const loadDataFromApis = async () => {
    setLoading(true);
    setApiStatus('CONNECTING');
    try {
      const venuesResult = await fetchLiveVenues();
      const eventsResult = await fetchLiveEvents(venuesResult.venues);

      setVenues(venuesResult.venues);
      setEvents(eventsResult.events);
      setApiStatus(venuesResult.venues.length > 0 ? 'LIVE' : 'ERROR');
    } catch (err) {
      console.error('Error cargando fuentes de información espacial en tiempo real:', err);
      setApiStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDataFromApis();
  }, []);

  const filteredEvents = useMemo(() => {
    return filterConcertEvents(events, artistFilter, venueFilter, today);
  }, [events, artistFilter, venueFilter, today]);

  useEffect(() => {
    if (selectedEventId && !filteredEvents.some(e => e.id.toString() === selectedEventId.toString())) {
      setSelectedEventId(null);
    }
  }, [filteredEvents, selectedEventId]);

  useEffect(() => {
    if (selectedEventId && markerRef.current) {
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedEventId]);

  const activeVenues = useMemo(() => {
    return resolveActiveVenues(selectedEventVenue, venueFilter, artistFilter, venues, filteredEvents);
  }, [venues, filteredEvents, venueFilter, artistFilter, selectedEventVenue]);

  const { targetPos, targetZoom } = useMemo(() => {
    return resolveMapTarget(selectedEventVenue, selectedVenue, rosarioPosition);
  }, [selectedEventVenue, selectedVenue, rosarioPosition]);

  return (
    <div className="map-page-container">
      <header className="header" style={{ padding: '20px 5%', background: 'var(--bg-dark)', maxWidth: '100%', boxSizing: 'border-box' }}>
        <h1 className="logo" style={{ fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="Logo" 
            className="header-logo-img" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = './logo.png';
            }}
          />
          <span>Concerts Tracker - Mapa interactivo</span>
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
            <div 
              className={`api-badge ${apiStatus === 'LIVE' ? 'live' : apiStatus === 'ERROR' ? 'error' : 'connecting'}`} 
              title={
                apiStatus === 'LIVE' 
                  ? 'Geoservicios y eventos conectados en tiempo real' 
                  : apiStatus === 'ERROR' 
                    ? 'No se pudo conectar con las APIs. Hacé clic en reintentar' 
                    : 'Conectando con APIs en tiempo real...'
              }
            >
              <span 
                className={`api-badge-dot ${apiStatus === 'LIVE' ? 'live' : apiStatus === 'ERROR' ? 'error' : 'connecting'}`}
              ></span>
              <FaBroadcastTower size={12} />
              <span>
                {apiStatus === 'LIVE' && 'APIs en Vivo: OpenStreetMap + Bandsintown'}
                {apiStatus === 'CONNECTING' && 'Conectando con APIs...'}
                {apiStatus === 'ERROR' && 'Sin conexión con APIs'}
              </span>
              {apiStatus === 'ERROR' && (
                <button 
                  type="button"
                  className="api-retry-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    void loadDataFromApis();
                  }}
                  title="Reintentar conexión con las APIs"
                >
                  <FaSyncAlt size={10} className={loading ? 'spinning' : ''} />
                  <span>Reintentar</span>
                </button>
              )}
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
                          {v.type && <span className="option-type-tag">{translateVenueType(v.type, v.name)}</span>}
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
                    <FaBroadcastTower size={24} style={{ color: 'var(--violet-light)', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
                    Consultando APIs en tiempo real (Bandsintown, MusicBrainz & OpenStreetMap)...
                  </div>
                );
              }
              if (apiStatus === 'ERROR' && filteredEvents.length === 0) {
                return (
                  <div className="no-results api-error-container">
                    <FaBroadcastTower size={26} color="#ef4444" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
                    <p style={{ color: '#fca5a5', fontWeight: 500, margin: '0 0 12px 0' }}>
                      No se pudo conectar con las APIs de eventos y recintos en este momento.
                    </p>
                    <button 
                      type="button" 
                      className="btn-retry-large"
                      onClick={() => void loadDataFromApis()}
                    >
                      <FaSyncAlt size={12} className={loading ? 'spinning' : ''} />
                      Reintentar conexión
                    </button>
                  </div>
                );
              }
              if (filteredEvents.length === 0) {
                return (
                  <div className="no-results">
                    <FaMusic size={22} color="var(--violet-light)" style={{ marginBottom: '8px', opacity: 0.7 }} />
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
                          <span className="venue-tag">{translateVenueType(venue.type, venue.name)}</span>
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
                  <Popup 
                    className="custom-popup"
                    autoPan={true}
                    autoPanPaddingTopLeft={[25, 95]}
                    autoPanPaddingBottomRight={[25, 25]}
                  >
                    <div className="popup-inner-container">
                      <div className="popup-header-block">
                        <div className="popup-venue-title-row">
                          <div className="popup-venue-icon">
                            <FaMapMarkerAlt size={14} />
                          </div>
                          <div className="popup-venue-name">{venue.name}</div>
                        </div>
                        <div className="popup-tags-row">
                          {venue.type && (
                            <span className="popup-venue-tag">{translateVenueType(venue.type, venue.name)}</span>
                          )}
                          <span className="popup-source-tag">
                            {venue.source || 'OpenStreetMap'}
                          </span>
                        </div>
                        {venue.address && (
                          <div className="popup-venue-address">
                            <FaMapMarkerAlt size={10} style={{ color: 'var(--violet-light)', flexShrink: 0 }} />
                            <span>{venue.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="popup-events-section">
                        {venueEvents.length > 0 ? (
                          <>
                            <div className="popup-section-header">
                              <FaMusic size={11} className="popup-section-icon" />
                              <span>
                                {venueEvents.length === 1 ? '1 Concierto próximo' : `${venueEvents.length} Conciertos próximos`}
                              </span>
                            </div>
                            <div className="popup-events-list">
                              {venueEvents.map(ev => {
                                const isThisConcertSelected = selectedEventId !== null && ev.id.toString() === selectedEventId.toString();
                                return (
                                  <div 
                                    key={ev.id} 
                                    role="button"
                                    tabIndex={0}
                                    className={`popup-event-card ${isThisConcertSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedEventId(isThisConcertSelected ? null : ev.id)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelectedEventId(isThisConcertSelected ? null : ev.id);
                                      }
                                    }}
                                    title="Haz clic para seleccionar este recital"
                                  >
                                    {isThisConcertSelected && (
                                      <div className="popup-selected-pill">
                                        <FaCheck size={9} /> Concierto seleccionado
                                      </div>
                                    )}
                                    <div className="popup-artist-name">{ev.artist}</div>
                                    
                                    <div className="popup-event-meta">
                                      <div className="popup-meta-item">
                                        <FaCalendarAlt size={11} className="popup-meta-icon" />
                                        <span>{new Date(ev.date + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                      </div>
                                      {ev.genre && (
                                        <div className="popup-meta-item">
                                          <FaMusic size={11} className="popup-meta-icon" />
                                          <span>{ev.genre}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="popup-event-actions">
                                      {ev.ticketUrl && (
                                        <a 
                                          href={ev.ticketUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="popup-ticket-btn"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <FaTicketAlt size={11} /> Entradas oficiales <FaExternalLinkAlt size={8} />
                                        </a>
                                      )}
                                      <button
                                        type="button"
                                        className={`popup-select-btn ${isThisConcertSelected ? 'active' : ''}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEventId(isThisConcertSelected ? null : ev.id);
                                        }}
                                      >
                                        {isThisConcertSelected ? 'Desmarcar' : 'Ver detalle'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="popup-empty-notice">
                            <div className="popup-empty-icon-box">
                              <FaBroadcastTower size={15} />
                            </div>
                            <div className="popup-empty-content">
                              <p className="popup-empty-title">Recinto Oficial Verificado</p>
                              <p className="popup-empty-desc">Datos en tiempo real vía geoservicios. Sin conciertos confirmados por el momento.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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
