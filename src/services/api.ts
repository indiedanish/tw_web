import axios from "axios";
import { ApiResponse, PaginationParams } from "../types";

const API_URL =
  "http://localhost:3000/api/location";

export const fetchLocationData = async (
  pagination: PaginationParams = { page: 1, limit: 10 }
): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL, {
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
