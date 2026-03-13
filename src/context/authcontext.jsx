import React, { createContext, useState } from 'react'; // Removed useContext

// Create the authentication context
const LOCAL_STORAGE_KEY = "authData"; // Key for localStorage
export const AuthContext = createContext(null); // Export AuthContext

/**
 * Provides authentication context to its children.
 * @param {object} props - React component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} - The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
    // Initialize authData from localStorage, if available
    const [authData, setAuthData] = useState(() => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : null;
    });

    /**
     * Logs in a user by setting the authentication data.
     * @param {object} data - The authentication data (e.g., from a successful login API response).
     */
    const login = (data) => {
        setAuthData(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    };

    /**
     * Logs out the current user by clearing the authentication data.
     */
    const logout = () => {
        setAuthData(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    // Provide the authentication context value
    const value = {
        authData,
        login,
        logout,
        isAuthenticated: !!authData, // Boolean indicating if the user is authenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};