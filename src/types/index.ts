export interface DestinationLocation {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  name: string;
  mapsUrl: string;
  category: string[];
  price: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  address: string;
  location: DestinationLocation;
  openingHours: string[];
  openStatus: 'open' | 'closed' | 'unknown';
  description: string;
  photos?: string[];
  photoUrl?: string;
  fotoUrl?: string;
  image?: string;
  website: string | null;
  phone: string;
}

export interface ScoringPreference {
  category: string;
  budget: string;
  preferredTags: string[];
}

export interface ScoredDestination extends Destination {
  score: number;
}

export interface PlaceSuggestion {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}
