import { PodStatus as PrismaStatus } from '@prisma/client';

export type PodStatus = PrismaStatus;

export interface PodLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface PodAvailability {
  podId: string;
  status: PodStatus;
  nextAvailable?: Date;
}

export interface NearbyPodsQuery {
  latitude?: number;
  longitude?: number;
  radius?: number;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface PodDetails {
  id: string;
  name: string;
  status: PodStatus;
  location: PodLocation;
  hourlyRate: number;
  lockId: string;
  currentBooking?: {
    id: string;
    startTime: Date;
    endTime: Date;
  };
} 