import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(""); // Initial state without localStorage

    useEffect(() => {
        // Accessing localStorage only after component mounts
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    }, []); // Only run on client after the initial render

    const login = (id) => {
        setUserId(id);
        if (typeof window !== "undefined") {
            localStorage.setItem("userId", id);  // Store in localStorage
        }
    };

    const logout = () => {
        setUserId("");
        if (typeof window !== "undefined") {
            localStorage.removeItem("userId");
        }
    };

    return (
        <AuthContext.Provider value={{ userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
