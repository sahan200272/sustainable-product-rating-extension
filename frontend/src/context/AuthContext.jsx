import { createContext, useState, useCallback } from "react";

export const AuthContext = createContext(null);

/**
 * Provides global auth state (user, token, login, logout, isAuthenticated).
 * Reads the initial state from localStorage so the user stays logged in on refresh.
 */
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const login = useCallback((userData, authToken) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }, []);

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
