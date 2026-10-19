import { Venue, ConcertEvent } from '../types';

/**
 * Calcula la distancia geodésica en metros entre dos coordenadas (Fórmula de Haversine)
 */
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radio medio de la Tierra en metros
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Consulta en tiempo real las geometrías de OpenStreetMap (vía motor abierto Photon / OSM)
 * para obtener dinámicamente los escenarios, teatros, anfiteatros, hipódromos y estadios de Rosario.
 * 100% OpenStreetMap. Sin datos ni arrays hardcodeados.
 */
export async function fetchLiveVenues(): Promise<{ venues: Venue[]; isLive: boolean }> {
  const venuesMap = new Map<string, Venue>();

  try {
    const queries = [
      'estadio Rosario Argentina',
      'teatro Rosario Argentina',
      'Anfiteatro Municipal Humberto de Nito Rosario',
      'hipodromo Rosario Argentina',
      'Metropolitano Rosario Argentina',
      'Bioceres Arena Rosario'
    ];

    const results = await Promise.all(
      queries.map(q =>
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=12`, {
          headers: { 'Accept': 'application/json' }
        })
          .then(r => r.ok ? r.json() : { features: [] })
          .catch(() => ({ features: [] }))
      )
    );

    results.forEach(res => {
      (res.features || []).forEach((f: any) => {
        const name = (f.properties?.name || '').trim();
        const lower = name.toLowerCase();

        // Filtrar ruidos, estaciones numeradas (bicicleteros como '30 - Estadio Municipal'), etc.
        if (
          !name ||
          /^\d+\s*[-–]/.test(name) ||
          lower.includes('pista') ||
          lower.includes('bici') ||
          lower.includes('parque industrial') ||
          lower.includes('ciudad industria') ||
          lower.includes('parada') ||
          lower.includes('calle') ||
          lower.includes('vega') ||
          lower.includes('hockey') ||
          f.properties?.osm_value === 'bicycle_rental' ||
          f.properties?.osm_value === 'pitch'
        ) {
          return;
        }

        const [lon, lat] = f.geometry?.coordinates || [];
        if (!lat || !lon) return;

        // Bounding box estricto del Gran Rosario (-33.15 a -32.80 lat, -60.85 a -60.55 lon)
        if (lat < -33.15 || lat > -32.80 || lon < -60.85 || lon > -60.55) {
          return;
        }

        let cleanName = name;
        // Normalizar nombres redundantes del mismo estadio (ej. Marcelo A. Bielsa -> Marcelo Bielsa)
        if (lower.includes('marcelo') && lower.includes('bielsa')) {
          cleanName = 'Estadio Marcelo Bielsa';
        }

        const osmValue = f.properties?.osm_value;
        let cleanType = 'Escenario';
        if (osmValue === 'stadium' || lower.includes('estadio')) cleanType = 'Estadio';
        else if (osmValue === 'theatre' || lower.includes('teatro') || lower.includes('anfiteatro')) cleanType = 'Teatro / Anfiteatro';
        else if (lower.includes('hipódromo') || lower.includes('hipodromo')) cleanType = 'Hipódromo / Predio';
        else if (lower.includes('arena') || lower.includes('metropolitano')) cleanType = 'Arena / Salón';

        // Unificar si hay duplicados a menos de 100m de distancia (mismo predio OSM)
        let isDuplicate = false;
        for (const existing of venuesMap.values()) {
          const dist = getDistanceMeters(lat, lon, existing.pos[0], existing.pos[1]);
          if (dist < 100 || existing.name.toLowerCase() === cleanName.toLowerCase()) {
            isDuplicate = true;
            break;
          }
        }

        if (!isDuplicate) {
          const key = cleanName.toLowerCase();
          venuesMap.set(key, {
            id: `osm-${f.properties?.osm_id || Math.abs(lat + lon).toFixed(4)}`,
            name: cleanName,
            address: `${f.properties?.street || cleanName}, Rosario, Santa Fe`,
            type: cleanType,
            pos: [lat, lon],
            source: 'OpenStreetMap'
          });
        }
      });
    });

    const venueList = Array.from(venuesMap.values());
    return {
      venues: venueList,
      isLive: venueList.length > 0
    };
  } catch (error) {
    console.error('Error al consultar geoservicios de escenarios desde OpenStreetMap:', error);
    return {
      venues: Array.from(venuesMap.values()),
      isLive: false
    };
  }
}

function isRosarioLocation(city: string, venueName: string, lat: number, lon: number): boolean {
  return (
    city.toLowerCase().includes('rosario') || 
    venueName.toLowerCase().includes('rosario') ||
    (!Number.isNaN(lat) && !Number.isNaN(lon) && lat >= -33.15 && lat <= -32.75 && lon >= -60.85 && lon <= -60.50)
  );
}

function matchOsmVenue(lat: number, lon: number, venueName: string, osmVenues: Venue[]): Venue | null {
  // 1. Unificación espacial por distancia mínima
  if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
    let minDistance = Infinity;
    let closestVenue: Venue | null = null;
    for (const osmV of osmVenues) {
      const dist = getDistanceMeters(lat, lon, osmV.pos[0], osmV.pos[1]);
      if (dist < minDistance) {
        minDistance = dist;
        if (dist <= 600) {
          closestVenue = osmV;
        }
      }
    }
    if (closestVenue) return closestVenue;
  }

  // 2. Emparejamiento semántico por palabras clave
  const vLower = venueName.toLowerCase();
  return osmVenues.find(osmV => {
    const oLower = osmV.name.toLowerCase();
    return (
      (vLower.includes('anfiteatro') && oLower.includes('anfiteatro')) ||
      (vLower.includes('hipódromo') && oLower.includes('hipódromo')) ||
      ((vLower.includes('bielsa') || vLower.includes('newell')) && (oLower.includes('bielsa') || oLower.includes('newell'))) ||
      ((vLower.includes('arroyito') || vLower.includes('central')) && (oLower.includes('arroyito') || oLower.includes('central'))) ||
      (vLower.includes('metropolitano') && oLower.includes('metropolitano')) ||
      ((vLower.includes('bioceres') || vLower.includes('vorterix')) && (oLower.includes('bioceres') || oLower.includes('vorterix')))
    );
  }) || null;
}

/**
 * Consulta en tiempo real los conciertos exclusivamente desde la API de Bandsintown.
 * Unifica espacialmente cada concierto con los recintos de OpenStreetMap:
 * Si la distancia entre las coordenadas del evento y un recinto OSM es muy pequeña (<= 600m),
 * se asigna siempre a la coordenada exacta y nombre oficial de OpenStreetMap.
 */
export async function fetchLiveEvents(osmVenues: Venue[]): Promise<{ 
  events: ConcertEvent[]; 
  isLive: boolean;
}> {
  const eventsMap = new Map<string, ConcertEvent>();
  const today = new Date().toISOString().split('T')[0];

  // Artistas clave de giras de rock, trap, pop, indie y música nacional en Argentina
  const touringArtists = [
    'Fito Páez', 'Babasonicos', 'Divididos', 'WOS', 'Duki', 
    'Ciro y los Persas', 'Nicki Nicole', 'Charly García', 'La Renga', 
    'Los Piojos', 'Airbag', 'Tan Biónica', 'Conociendo Rusia', 
    'El Kuelgue', 'Bandalos Chinos', 'Cazzu', 'Emilia', 'Milo J', 
    'Dillom', 'Trueno', 'Bizarrap', 'La Vela Puerca', 'No Te Va Gustar', 
    'Cuarteto de Nos', 'Lali', 'Maria Becerra', 'Tiago PZK', 'Ysy A',
    'Las Pastillas del Abuelo', 'Guasones', 'La Beriso', 'David Lebon', 'Pedro Aznar'
  ];

  try {
    const bitPromises = touringArtists.map(artist =>
      fetch(`https://rest.bandsintown.com/artists/${encodeURIComponent(artist)}/events?app_id=12345`, {
        headers: { 'Accept': 'application/json' }
      })
        .then(res => res.ok ? res.json() : [])
        .catch(() => [])
    );

    const bitResults = await Promise.all(bitPromises);

    bitResults.flat().forEach((ev: any) => {
      if (!ev?.datetime) return;

      const date = ev.datetime.slice(0, 10);
      if (!date || date < today) return;

      const city = ev.venue?.city || '';
      const venueName = ev.venue?.name || '';
      const artist = ev.lineup?.[0] || ev.artist?.name || 'Artista';
      const lat = Number.parseFloat(ev.venue?.latitude);
      const lon = Number.parseFloat(ev.venue?.longitude);

      if (!isRosarioLocation(city, venueName, lat, lon)) return;

      const matchedOSM = matchOsmVenue(lat, lon, venueName, osmVenues);

      if (matchedOSM) {
        const dedupeKey = `${artist.toLowerCase()}_${date}_${matchedOSM.id}`;
        if (!eventsMap.has(dedupeKey)) {
          eventsMap.set(dedupeKey, {
            id: `bit-${ev.id}`,
            artist,
            date,
            venueId: matchedOSM.id,
            venueName: matchedOSM.name,
            city: 'Rosario',
            genre: 'Concierto en Vivo',
            ticketUrl: ev.offers?.[0]?.url || ev.url,
            source: 'Bandsintown'
          });
        }
      }
    });

    // Ordenar automáticamente por fecha cronológica ascendente
    const sortedEvents = Array.from(eventsMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      events: sortedEvents,
      isLive: sortedEvents.length > 0
    };
  } catch (error) {
    console.error('Error al consultar eventos en vivo desde Bandsintown:', error);
    return {
      events: [],
      isLive: false
    };
  }
}
