export interface WorkPodStatus {
  isAvailable: boolean;
  lastChecked: Date;
  maintenanceRequired: boolean;
}

export interface WorkPodAvailability {
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
} 