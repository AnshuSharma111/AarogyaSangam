import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Appointments = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patients and their appointments from backend
    axios.get(`${API_BASE_URL}/appointments`)
      .then((response) => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4" style={{ fontFamily: "Poppins, sans-serif" }}>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Patient Appointments</h2>

      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <div className="space-y-4">
          {patients.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            patients.map((patient) => (
              <div key={patient.id} className="border p-4 rounded-lg shadow-md">
                <p className="text-lg font-semibold">Patient: {patient.name}</p>
                <p>Mobile: {patient.mobile}</p>
                <p>Status: {patient.status}</p>
                <p>Appointment Time: {patient.bookingTime}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;
