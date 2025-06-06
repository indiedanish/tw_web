import axios from 'axios';
import { ApiResponse } from '../types';

const API_URL = 'http://ec2-52-66-236-101.ap-south-1.compute.amazonaws.com:3000/api/location';

export const fetchLocationData = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw new Error('Failed to fetch location data. Please try again later.');
  }
};