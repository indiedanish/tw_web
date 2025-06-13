import React, { useEffect, useState } from 'react';
import { useLocationData } from '../contexts/LocationDataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Filters } from './Filters';
import { LocationTable } from './LocationTable';
import { Charts } from './Charts';
import { Map } from './Map';
import { AnalyticsCards } from './AnalyticsCards';
import { LocationDataAccordion } from './LocationDataAccordion';
import { Configs } from './Configs';
import { MapPin, RefreshCw, FileBarChart, BarChart3, Table, Map as MapIcon, LogOut, List, Settings } from 'lucide-react';
import { DeviceConfigs } from './DeviceConfigs';

// Separate component for the main dashboard content
const DashboardContent = () => {
  const {
    loading,
    error,
    filteredData,
    refreshData,
    selectedLocation,
    setSelectedLocation
  } = useLocationData();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentView, setCurrentView] = useState<'table' | 'charts' | 'map' | 'accordion'>('table');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConfigNavigation = () => {
    navigate('/configs');
  };

  useEffect(() => {
    if (filteredData.length > 0 && !selectedLocation) {
      setSelectedLocation(filteredData[0]);
    }
  }, [filteredData, selectedLocation, setSelectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
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
                  onClick={() => setCurrentView('accordion')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${currentView === 'accordion'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <List className="h-4 w-4" />
                  Details
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
                onClick={handleConfigNavigation}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
                title="Configuration"
              >
                <Settings className="h-4 w-4" />
                Config
              </button>
              <button
                onClick={() => navigate('/device-configs')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
                title="Device Configurations"
              >
                <Settings className="h-4 w-4" />
                Device Configs
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
        </div>
      </header>

      <div className="container mx-auto px-4 pt-[1000px] md:pt-[450px] lg:pt-[400px] xl:pt-[350px] pb-8">
        {error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : null}

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
          ) : currentView === 'accordion' ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <LocationDataAccordion />
              </div>
            </div>
          ) : currentView === 'charts' ? (
            <Charts />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Map view placeholder */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard component with routing
export const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardContent />} />
      <Route path="/configs" element={<Configs />} />
      <Route path="/device-configs" element={<DeviceConfigs />} />
    </Routes>
  );
};