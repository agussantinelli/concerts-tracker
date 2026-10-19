export interface Venue {
  id: string | number;
  name: string;
  address?: string;
  type?: string;
  pos: [number, number];
  source?: 'MusicBrainz' | 'OpenStreetMap' | 'Bandsintown' | 'Base';
}

export interface ConcertEvent {
  id: string | number;
  artist: string;
  date: string;
  venueId: string | number;
  venueName?: string;
  city?: string;
  genre: string;
  tour?: string;
  ticketUrl?: string;
  source?: 'MusicBrainz' | 'Bandsintown' | 'OpenStreetMap';
}

