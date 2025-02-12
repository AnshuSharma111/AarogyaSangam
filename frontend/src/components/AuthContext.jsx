import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId");
            const storedUsername = localStorage.getItem("username");
            if (storedUserId && storedUsername) {
                setUserId(storedUserId);
                setUsername(storedUsername);
            }
        }
    }, []);

    const login = (id, name) => {
        setUserId(id);
        setUsername(name);
        if (typeof window !== "undefined") {
            localStorage.setItem("userId", id);
            localStorage.setItem("username", name);
        }
    };

    const logout = () => {
        setUserId("");
        setUsername("");
        if (typeof window !== "undefined") {
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
        }
    };

    return (
        <AuthContext.Provider value={{ userId, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
