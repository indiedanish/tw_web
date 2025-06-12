import React from 'react';
import { Filter } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useLocationData } from '../contexts/LocationDataContext';

export const Filters = () => {
  const {
    devices,
    filters,
    setFilters,
    clearFilters,
    filteredData,
    locationData
  } = useLocationData();

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? null : e.target.value;
    console.log('Device changed to:', value); // Debug log
    setFilters({ ...filters, imei: value });
  };

  const handleDateChange = (key: 'startDate' | 'endDate', date: Date | null) => {
    console.log('Date changed:', key, date); // Debug log
    setFilters({ ...filters, [key]: date });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filter Data</h2>
        <div className="ml-auto text-sm text-gray-500">
          Showing {filteredData.length} of {locationData.length} records
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label htmlFor="device" className="block text-sm font-medium text-gray-700">
            Select Device
          </label>
          <select
            id="device"
            value={filters.imei || ""}
            onChange={handleDeviceChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option  value='all'>All Devices</option>
            {devices.map((device) => (
              <option key={device.id} value={device.imei}>
                {device.name} ({device.imei})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <DatePicker
            id="startDate"
            selected={filters.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select start date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <DatePicker
            id="endDate"
            selected={filters.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select end date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleClearFilters}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};