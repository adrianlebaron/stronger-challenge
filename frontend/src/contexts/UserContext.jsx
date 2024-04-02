import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const savedToken = Cookies.get('authToken');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const isAuthenticated = () => {
        return token !== '';
    };

    useEffect(() => {
        if (token) {
            Cookies.set('authToken', token, { expires: 7 });
        } else {
            Cookies.remove('authToken');
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
