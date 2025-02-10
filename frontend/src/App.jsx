import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import MedicineReceipt from "./pages/MedicineReceipt";
import Appointments from "./pages/Appointments";
import Inventory from "./pages/Inventory";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { API_BASE_URL } from "./config";

const App = () => {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  // Check if backend is running
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/`)
      .then((response) => setBackendStatus(response.data.message || "Backend connected!"))
      .catch((error) => {
          console.error("Backend connection error:", error);
          setBackendStatus("Backend not connected!");
      });
}, []);

  return (
    <AuthProvider>
      <Router>
        {/* Flex container to house Sidebar and Main Content */}
        <div className="flex">
          {/* Sidebar Component */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-grow ml-64 p-10">
            {/* Display Backend Status */}
            <div className="p-4 mb-4 text-white bg-blue-600 rounded">
              {backendStatus}
            </div>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Appointments />} />
              <Route path="/medical-receipt" element={<MedicineReceipt />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
