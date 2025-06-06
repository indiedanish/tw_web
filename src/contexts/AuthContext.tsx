import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

const AUTH_STORAGE_KEY = 'location_dashboard_auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check localStorage on component mount
    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
                if (savedAuth) {
                    const authData = JSON.parse(savedAuth);
                    // Check if the saved auth is valid and not expired
                    if (authData.isAuthenticated && authData.timestamp) {
                        // Optional: Add expiration check (e.g., 24 hours)
                        const now = new Date().getTime();
                        const authTime = new Date(authData.timestamp).getTime();
                        const hoursElapsed = (now - authTime) / (1000 * 60 * 60);

                        // Auto-logout after 24 hours (optional)
                        if (hoursElapsed < 24) {
                            setIsAuthenticated(true);
                        } else {
                            localStorage.removeItem(AUTH_STORAGE_KEY);
                        }
                    }
                }
            } catch (error) {
                console.error('Error reading auth from localStorage:', error);
                localStorage.removeItem(AUTH_STORAGE_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (username: string, password: string): boolean => {
        // Hardcoded credentials
        if (username === 'tw@placentek.com' && password === 'tw@placentek') {
            setIsAuthenticated(true);

            // Save to localStorage
            const authData = {
                isAuthenticated: true,
                timestamp: new Date().toISOString(),
                username: 'admin' // Don't save password for security
            };

            try {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
            } catch (error) {
                console.error('Error saving auth to localStorage:', error);
            }

            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);

        // Remove from localStorage
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (error) {
            console.error('Error removing auth from localStorage:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}; 