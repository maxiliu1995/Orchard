export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationSearchParams extends Coordinates {
  radius: number;  // in meters
}

export interface PodLocation extends Coordinates {
  id: string;
  name: string;
  address: string;
  distance?: number;  // distance from search point in km
} 