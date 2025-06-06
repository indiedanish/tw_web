import React, { useEffect, useRef } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { useLocationData } from '../contexts/LocationDataContext';

export const Map = () => {
  const { selectedLocation } = useLocationData();
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!selectedLocation) return;
    
    // In a real application, this is where you would initialize and update
    // a map library like Google Maps, Mapbox, or Leaflet
    // For this demo, we'll just display a placeholder
    if (mapRef.current) {
      const mapElement = mapRef.current;
      mapElement.innerHTML = '';
      
      const infoElement = document.createElement('div');
      infoElement.className = 'text-center p-4';
      infoElement.innerHTML = `
        <p class="font-semibold mb-2">Location Information</p>
        <p>Latitude: ${selectedLocation.latitude.toFixed(6)}</p>
        <p>Longitude: ${selectedLocation.longitude.toFixed(6)}</p>
        <p>Altitude: ${selectedLocation.altitude}m</p>
        <p>Accuracy: ${selectedLocation.accuracy}m</p>
        <p>Bearing: ${selectedLocation.bearing}°</p>
        <p class="mt-4 text-xs text-gray-500">In a production environment, this would display an interactive map with the location marker.</p>
      `;
      
      mapElement.appendChild(infoElement);
    }
  }, [selectedLocation]);

  if (!selectedLocation) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-gray-50 p-4">
        <MapIcon className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-gray-500 text-center">Select a location from the table to view on the map</p>
      </div>
    );
  }

  return (
    <div className="h-96 relative">
      <div ref={mapRef} className="h-full w-full bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    </div>
  );
};