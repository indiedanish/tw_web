import React from 'react';
import { Dashboard } from './components/Dashboard';
import { LocationDataProvider } from './contexts/LocationDataContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LocationDataProvider>
        <Dashboard />
      </LocationDataProvider>
    </div>
  );
}

export default App;