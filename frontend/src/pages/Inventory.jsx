import React, { useState, useEffect, useRef } from 'react';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medicine');
        const data = await response.json();
        if (data.success) {
          setInventoryData(data.data);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchData();

    const connectWebSocket = () => {
      wsRef.current = new WebSocket('ws://localhost:5000');

      wsRef.current.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      wsRef.current.onmessage = (event) => {
        try {
          console.log("WebSocket Message Received:", event.data);
          const parsedData = JSON.parse(event.data);
          if (parsedData.type === 'inventory_update') {
            setInventoryData(parsedData.data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Function to format expiry date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Converts to DD/MM/YYYY format
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-700" style={{ fontFamily: "Poppins, sans-serif" }}>
        Inventory
      </h1>
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
