import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/appointment`)
      .then((response) => {
        console.log("API Response:", response.data.data); // Debugging API response

        // Ensure data is an array before setting state
        if (Array.isArray(response.data.data)) {
          setAppointments(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setAppointments([]); // Set to empty array to avoid .map errors
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setAppointments([]); // Prevent .map errors
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 font-[Poppins]">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Doctor Appointments
      </h2>

      {loading ? (
        <p className="text-lg text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-lg text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="py-3 px-5">Doctor Name</th>
                <th className="py-3 px-5">Appointment Time</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr
                  key={appointment._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  <td className="py-3 px-5">
                    {appointment.doctorId?.name || "Unknown"}
                  </td>
                  <td className="py-3 px-5">{appointment.timeSlot}</td>
                  <td
                    className={`py-3 px-5 font-semibold ${
                      appointment.status === "confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {appointment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;
