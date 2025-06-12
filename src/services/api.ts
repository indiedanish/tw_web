import axios from "axios";
import { ApiResponse, PaginationParams } from "../types";

const API_BASE_URL = "http://ec2-52-66-236-101.ap-south-1.compute.amazonaws.com:3000/api";
const LOCATION_API_URL = `${API_BASE_URL}/location`;
const CONFIG_API_URL = `${API_BASE_URL}/default-config`;

export const fetchLocationData = async (
  pagination: PaginationParams = { page: 1, limit: 10 }
): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(LOCATION_API_URL, {
      params: {
        page: pagination.page,
        limit: pagination.limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw new Error("Failed to fetch location data. Please try again later.");
  }
};

export interface DefaultConfig {
  id: number;
  gpsTimer: string;
  configTimer: string;
  uploadTimer: string;
  retryCounter: string;
  angleThreshold: string;
  overSpeedingThreshold: string;
  travelStartTimer: string;
  travelStopTimer: string;
  movingTimer: string;
  stopTimer: string;
  distanceThreshold: string;
  heartbeatTimer: string;
  liveStatusUpdateTimer: string;
  baseUrl: string;
}

export interface ConfigResponse {
  success: boolean;
  data: DefaultConfig;
  message?: string;
}

export interface ConfigUpdateRequest {
  gpsTimer: number;
  configTimer: number;
  uploadTimer: number;
  retryCounter: number;
  angleThreshold: number;
  overSpeedingThreshold: number;
  travelStartTimer: number;
  travelStopTimer: number;
  movingTimer: number;
  stopTimer: number;
  distanceThreshold: number;
  heartbeatTimer: number;
  liveStatusUpdateTimer: number;
}

export const fetchDefaultConfig = async (): Promise<ConfigResponse> => {
  try {
    const response = await axios.get<ConfigResponse>(CONFIG_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching default config:", error);
    throw new Error("Failed to fetch configuration. Please try again later.");
  }
};

export const updateDefaultConfig = async (
  config: ConfigUpdateRequest
): Promise<ConfigResponse> => {
  try {
    const response = await axios.put<ConfigResponse>(CONFIG_API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error updating default config:", error);
    throw new Error("Failed to update configuration. Please try again later.");
  }
};
