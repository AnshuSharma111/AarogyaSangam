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
  const [backendStatus, setBackendStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Check if backend is running
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/`)
      .then((response) => {
        setBackendStatus(response.data.message || "Backend connected!");
        setShowPopup(true);

        // Auto-hide the popup after 5 seconds
        setTimeout(() => setShowPopup(false), 5000);
      })
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
          <div className="flex-grow ml-64 p-10 relative">
            {/* Slide-in Backend Status Popup */}
            {showPopup && (
              <div
                className="fixed top-5 right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg transform transition-transform translate-x-0 animate-slide-in"
              >
                <div className="flex justify-between items-center">
                  <span>{backendStatus}</span>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="ml-4 text-white hover:text-gray-300"
                  >
                    ❌
                  </button>
                </div>
              </div>
            )}

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
