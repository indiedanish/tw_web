import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchLocationData } from '../services/api';
import { LocationData, Device, Filters, PaginationInfo, PaginationParams } from '../types';

interface LocationDataContextType {
  locationData: LocationData[];
  filteredData: LocationData[];
  devices: Device[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  pagination: PaginationInfo;
  setFilters: (filters: Filters) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  refreshData: () => Promise<void>;
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  changePage: (page: number) => Promise<void>;
  changeLimit: (limit: number) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
}

const LocationDataContext = createContext<LocationDataContextType | undefined>(undefined);

export const LocationDataProvider = ({ children }: { children: ReactNode }) => {
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [filteredData, setFilteredData] = useState<LocationData[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    offset: 0,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    resultCount: 0
  });

  const [filters, setFilters] = useState<Filters>({
    imei: null,
    startDate: null,
    endDate: null,
  });

  const loadData = async (paginationParams?: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);

      const paginationToUse = paginationParams || {
        page: pagination.currentPage,
        limit: pagination.limit
      };

      const data = await fetchLocationData(paginationToUse);

      setLocationData(data.locationsData);
      setFilteredData(data.locationsData);
      setDevices(data.devices);
      setPagination(data.pagination);

      // Set a default selected location if none is selected
      if (!selectedLocation && data.locationsData.length > 0) {
        setSelectedLocation(data.locationsData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Set up a refresh interval - uncomment for production use
    // const interval = setInterval(loadData, 60000); // Refresh every minute
    // return () => clearInterval(interval);
  }, []);

  const applyFilters = () => {
    let filtered = [...locationData];

    // Filter by device IMEI
    if (filters.imei) {
      filtered = filtered.filter(location => location.imei === filters.imei);
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(location => {
        const locationDate = new Date(parseInt(location.createdAt));
        return locationDate >= filters.startDate!;
      });
    }

    if (filters.endDate) {
      // Set end date to the end of the selected day
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(location => {
        const locationDate = new Date(parseInt(location.createdAt));
        return locationDate <= endDate;
      });
    }

    setFilteredData(filtered);

    // Update selected location if current one is filtered out
    if (selectedLocation && !filtered.some(l => l.id === selectedLocation.id)) {
      setSelectedLocation(filtered.length > 0 ? filtered[0] : null);
    }
  };

  const clearFilters = () => {
    setFilters({
      imei: null,
      startDate: null,
      endDate: null,
    });
    setFilteredData(locationData);
  };

  const refreshData = async () => {
    await loadData();
    applyFilters();
  };

  const changePage = async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await loadData({ page, limit: pagination.limit });
    }
  };

  const changeLimit = async (limit: number) => {
    await loadData({ page: 1, limit }); // Reset to first page when changing limit
  };

  const goToNextPage = async () => {
    if (pagination.hasNextPage) {
      await changePage(pagination.currentPage + 1);
    }
  };

  const goToPreviousPage = async () => {
    if (pagination.hasPreviousPage) {
      await changePage(pagination.currentPage - 1);
    }
  };

  return (
    <LocationDataContext.Provider
      value={{
        locationData,
        filteredData,
        devices,
        loading,
        error,
        filters,
        pagination,
        setFilters,
        applyFilters,
        clearFilters,
        refreshData,
        selectedLocation,
        setSelectedLocation,
        changePage,
        changeLimit,
        goToNextPage,
        goToPreviousPage,
      }}
    >
      {children}
    </LocationDataContext.Provider>
  );
};

export const useLocationData = () => {
  const context = useContext(LocationDataContext);
  if (context === undefined) {
    throw new Error('useLocationData must be used within a LocationDataProvider');
  }
  return context;
};