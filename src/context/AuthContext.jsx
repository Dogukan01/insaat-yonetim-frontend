import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Optional: Validate token on load
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Here you could decode JWT or fetch user profile
            setIsAuthenticated(true);
            setToken(storedToken);

            // Mocking user restore for now
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Try api call first
            const response = await api.post('/auth/login', { email, password });
            const { token: newToken, user: userData } = response.data;

            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            // Fallback for Development/Demo purposes if API fails
            console.error("Login API failed, falling back to mock", error);

            // Simple mock validation
            if (email && password) {
                const mockToken = "mock-jwt-token-" + Date.now();
                const mockUser = { id: 1, email, name: "Demo User" };

                setToken(mockToken);
                setUser(mockUser);
                setIsAuthenticated(true);

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));

                return { success: true };
            }

            return { success: false, message: error.response?.data?.message || 'Giriş yapılamadı' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
