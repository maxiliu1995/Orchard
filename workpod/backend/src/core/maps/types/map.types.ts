export interface MapConfig {
  apiKey: string;
  region?: string;
}

export interface Pod {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  address: string;
}

export type NearbyPodsResponse = {
  pods: Pod[];
  total: number;
};