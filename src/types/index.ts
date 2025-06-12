export interface Device {
  id: number;
  imei: string;
  name: string;
  phoneNo: string;
  emailAddress: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    locationData: number;
  };
}

export interface LocationData {
  id: number;
  accuracy: number;
  altitude: number;
  bearing: number;
  deviceRDT: string;
  emailAddress: string;
  gmtSettings: string;
  igStatus: number;
  imei: string;
  latitude: number;
  localPrimaryId: number;
  longitude: number;
  name: string;
  phoneNo: string;
  provider: string;
  reason: string;
  speed: number;
  time: string;
  versionNo: string;
  createdAt: string;
  updatedAt: string;
  deviceId: number;
  device: Device;
}

export interface Filters {
  imei: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  resultCount: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  imei?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ApiResponse {
  success: boolean;
  locationsData: LocationData[];
  devices: Device[];
  filters: {
    imei: string | null;
    startDate: string | null;
    endDate: string | null;
  };
  pagination: PaginationInfo;
}
