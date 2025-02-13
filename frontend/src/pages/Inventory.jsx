import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket instance
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    // Initial data fetch
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medicine');
        const data = await response.json();
        if (data.success) {
          setInventoryData(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      fetchData(); // Fetch initial data when connected
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('inventory_update', (data) => {
      console.log('Received inventory update:', data);
      setInventoryData(data);
    });

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('inventory_update');
      socket.off('connect_error');
      socket.close();
    };
  }, []); 

  // Function to format expiry date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-700" style={{ fontFamily: "Poppins, sans-serif" }}>
        Inventory
      </h1>
      {/* Connection Status Indicator */}
      <div className={`fixed bottom-4 right-4 p-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
        <span className="text-white text-sm px-3">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden bg-white">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Batch No</th>
              <th className="px-4 py-3">Medicine Name</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr
                key={item._id}
                className={`${index % 2 === 0 ? "bg-blue-200" : "bg-white"} text-center`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.batchno}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    item.quantity < 10 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.quantity}
                </td>
                <td className="px-4 py-3">{formatDate(item.expiry)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;