import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  applyFilters: () => Promise<void>;
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

  const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const loadData = useCallback(async (paginationParams?: Partial<PaginationParams>, customFilters?: Filters) => {
    try {
      setLoading(true);
      setError(null);

      const filtersToUse = customFilters || filters;
      const paginationToUse: PaginationParams = {
        page: paginationParams?.page || pagination.currentPage,
        limit: paginationParams?.limit || pagination.limit,
      };

      // Add filter parameters
      if (filtersToUse.imei) {
        paginationToUse.imei = filtersToUse.imei;
      }

      if (filtersToUse.startDate) {
        paginationToUse.startDate = formatDateForAPI(filtersToUse.startDate);
      }

      if (filtersToUse.endDate) {
        paginationToUse.endDate = formatDateForAPI(filtersToUse.endDate);
      }

      console.log('Making API request with params:', paginationToUse); // Debug log

      const data = await fetchLocationData(paginationToUse);

      setLocationData(data.locationsData);
      setFilteredData(data.locationsData); // Since filtering is done server-side now
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
  }, [filters, pagination.currentPage, pagination.limit, selectedLocation]);

  useEffect(() => {
    loadData();
  }, []);

  const applyFilters = useCallback(async () => {
    console.log('applyFilters called with:', filters); // Debug log
    // Reset to first page when applying filters
    await loadData({ page: 1, limit: pagination.limit }, filters);
  }, [filters, pagination.limit, loadData]);

  const clearFilters = useCallback(() => {
    const clearedFilters: Filters = {
      imei: null,
      startDate: null,
      endDate: null,
    };
    setFilters(clearedFilters);
    // Load data without filters
    loadData({ page: 1, limit: pagination.limit }, clearedFilters);
  }, [pagination.limit, loadData]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const changePage = useCallback(async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await loadData({ page, limit: pagination.limit });
    }
  }, [pagination.totalPages, pagination.limit, loadData]);

  const changeLimit = useCallback(async (limit: number) => {
    await loadData({ page: 1, limit }); // Reset to first page when changing limit
  }, [loadData]);

  const goToNextPage = useCallback(async () => {
    if (pagination.hasNextPage) {
      await changePage(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, changePage]);

  const goToPreviousPage = useCallback(async () => {
    if (pagination.hasPreviousPage) {
      await changePage(pagination.currentPage - 1);
    }
  }, [pagination.hasPreviousPage, pagination.currentPage, changePage]);

  // Auto-apply filters when filters change (moved from Filters component)
  useEffect(() => {
    if (filters.imei !== null || filters.startDate !== null || filters.endDate !== null) {
      console.log('Filters changed, applying...', filters); // Debug log
      applyFilters();
    }
  }, [filters, applyFilters]);

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