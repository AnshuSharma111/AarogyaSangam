import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize username from localStorage to ensure it loads instantly
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUsername = storedToken ? jwtDecode(storedToken)?.username || "" : "";

    const [username, setUsername] = useState(storedUsername);
    const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp > currentTime) {
                        setUsername(decoded.username);
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    localStorage.removeItem("token");
                }
            }
        }
    }, []);

    const login = (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            setUsername(decoded.username);
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        setUsername("");
        setIsAuthenticated(false);

        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
    };

    return (
        <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
