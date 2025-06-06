import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { LocationDataProvider } from './contexts/LocationDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationDataProvider>
        <Dashboard />
      </LocationDataProvider>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;