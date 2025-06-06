import React, { useEffect, useState } from 'react';
import { useLocationData } from '../contexts/LocationDataContext';
import { useAuth } from '../contexts/AuthContext';
import { Filters } from './Filters';
import { LocationTable } from './LocationTable';
import { Charts } from './Charts';
import { Map } from './Map';
import { AnalyticsCards } from './AnalyticsCards';
import { MapPin, RefreshCw, FileBarChart, BarChart3, Table, Map as MapIcon, LogOut } from 'lucide-react';

export const Dashboard = () => {
  const {
    loading,
    error,
    filteredData,
    refreshData,
    selectedLocation,
    setSelectedLocation
  } = useLocationData();
  const { logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<'table' | 'charts' | 'map'>('table');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (filteredData.length > 0 && !selectedLocation) {
      setSelectedLocation(filteredData[0]);
    }
  }, [filteredData, selectedLocation, setSelectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl mr-4 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Location Tracking Dashboard</h1>
                <p className="text-gray-600 text-lg">Monitor and analyze location data in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('table')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${currentView === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Table className="h-4 w-4" />
                  Table
                </button>
                <button
                  onClick={() => setCurrentView('charts')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${currentView === 'charts'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Charts
                </button>

              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={loading || isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <Filters />
        </header>

        {error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : null}

        {/* Analytics Cards */}
        <AnalyticsCards />

        <div className="space-y-8">
          {currentView === 'table' ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Location Data</h2>
                <p className="text-sm text-gray-600">Showing {filteredData.length} records</p>
              </div>
              <LocationTable />
            </div>
          ) : currentView === 'charts' ? (
            <Charts />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">

            </div>
          )}
        </div>
      </div>
    </div>
  );
};