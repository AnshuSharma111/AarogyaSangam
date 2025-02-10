import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const { userId } = useAuth();
    return userId ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
