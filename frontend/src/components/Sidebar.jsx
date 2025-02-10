import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, FileText, Box } from "lucide-react"; // Import necessary icons

const Sidebar = () => {
    const menuItems = [
        { name: "Appointments", path: "/appointments", icon: Calendar },
        { name: "Medical Receipt", path: "/medical-receipt", icon: FileText },
        { name: "Inventory", path: "/inventory", icon: Box },
    ];

    return (
        <div className="w-64 h-full bg-white rounded-2xl shadow-md fixed top-4 left-4 p-6 z-50">
            {/* Title with Montserrat font */}
            <h1 className="text-3xl font-bold mb-6 text-gray-700" style={{ fontFamily: "Montserrat" }}>
                Dashboard
            </h1>
            {/* Navigation with Poppins font */}
            <nav className="flex flex-col space-y-3" style={{ fontFamily: "Poppins" }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center py-3 px-5 rounded-lg font-medium text-gray-600 transition ${
                                isActive
                                    ? "bg-blue-100 text-blue-600 shadow-sm"
                                    : "hover:bg-gray-100 hover:text-blue-500"
                            }`
                        }
                    >
                        {/* Render the icon */}
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
