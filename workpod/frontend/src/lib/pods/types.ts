export type PodStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Offline';

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface PodLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Pod {
  id: string;
  name: string;
  status: PodStatus;
  hourlyRate: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Reservation {
    id: string;
    podId: string;
    userId: string;
    startTime: string;
    endTime?: string;
    status: 'Active' | 'Completed' | 'Cancelled';
    totalAmount?: number;
    addOns?: AddOn[];
}

// Add a mapper function to convert API response
export const mapApiPodToUiPod = (apiPod: any): Pod => ({
  ...apiPod,
  status: apiPod.status.charAt(0).toUpperCase() + apiPod.status.slice(1).toLowerCase()
});