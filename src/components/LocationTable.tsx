import React from 'react';
import { format } from 'date-fns';
import { Map, Activity, Clock, Navigation } from 'lucide-react';
import { useLocationData } from '../contexts/LocationDataContext';
import { LocationData } from '../types';
import { Pagination } from './Pagination';

export const LocationTable = () => {
  const { locationData, loading, setSelectedLocation, selectedLocation } = useLocationData();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading location data...</p>
      </div>
    );
  }

  if (locationData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Map className="mx-auto h-12 w-12 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium mb-1">No location data found</h3>
        <p>Try adjusting your filters or refreshing the data.</p>
      </div>
    );
  }

  const handleRowClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Speed
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locationData.map((location) => (
              <tr
                key={location.id}
                className={`hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${selectedLocation?.id === location.id ? 'bg-blue-50' : ''
                  }`}
                onClick={() => handleRowClick(location)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.imei}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Map className="h-4 w-4 text-gray-500 mr-1" />
                    <div className="text-sm text-gray-900">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <div className="text-sm text-gray-500">{format(new Date(location.createdAt), 'dd/MM/yyyy HH:mm:ss')}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 text-gray-500 mr-1" />
                    <div className="text-sm text-gray-900">{location.speed} km/h</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {location.reason}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
};