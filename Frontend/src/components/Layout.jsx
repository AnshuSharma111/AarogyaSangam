import React from "react";
import Sidebar from "./Sidebar"; // Import your sidebar component
import { Outlet } from "react-router-dom"; // Outlet for nested routes

const Layout = () => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 p-4">
                <Outlet /> {/* Renders the current route's component */}
            </div>
        </div>
    );
};

export default Layout;
