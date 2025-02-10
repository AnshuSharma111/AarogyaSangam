import React from 'react';
import Card from '../components/ui/card';

const Inventory = () => {
  const inventoryData = [
    { id: 1, name: 'Paracetamol', medId: 'MED123', stock: 50, expiry: '2025-03-15' },
    { id: 2, name: 'Ibuprofen', medId: 'MED124', stock: 30, expiry: '2024-11-10' },
    { id: 3, name: 'Amoxicillin', medId: 'MED125', stock: 20, expiry: '2025-01-20' },
    { id: 4, name: 'Aspirin', medId: 'MED126', stock: 50, expiry: '2025-03-15' },
    { id: 5, name: 'Cetirizine', medId: 'MED127', stock: 30, expiry: '2024-11-10' },
    { id: 6, name: 'Loratadine', medId: 'MED128', stock: 20, expiry: '2025-01-20' },
    { id: 7, name: 'Metformin', medId: 'MED129', stock: 50, expiry: '2025-03-15' },
    { id: 8, name: 'Simvastatin', medId: 'MED130', stock: 30, expiry: '2024-11-10' },
    { id: 9, name: 'Omeprazole', medId: 'MED131', stock: 20, expiry: '2025-01-20' },
  ];

  return (
    <div className="min-h-screen  p-6" style={{ fontFamily: 'Poppins' }}>
      <h1 className="text-4xl font-bold text-gray-600 mb-8" style={{ fontFamily: 'Montserrat' }}>Inventory</h1>
      <div className="grid gap-6">
        <Card className="p-8 shadow-lg rounded-2xl">
          <div className="w-full">
            {/* Header Row */}
            <div className="grid grid-cols-5  mb-6">
              <div className="font-medium text-xl text-gray-700 text-center">Sr. No.</div>
              <div className="font-medium text-xl text-gray-700 text-center">Medicine ID</div>
              <div className="font-medium text-xl text-gray-700 text-center">Medicine Name</div>
              <div className="font-medium text-xl text-gray-700 text-center">Stock</div>
              <div className="font-medium text-xl text-gray-700 text-center">Expiry Date</div>
            </div>

            {/* Data Rows */}
            {inventoryData.map((item, index) => (
              <div key={item.medId} className="grid grid-cols-5 gap-4 mb-4 rounded-xl shadow-lg p-4 bg-blue-200">
                <div className="text-lg text-gray-600 text-center">{index + 1}</div>
                <div className="text-lg text-gray-600 text-center">{item.medId}</div>
                <div className="text-lg text-gray-600 text-center">{item.name}</div>
                <div className="text-lg text-gray-600 text-center">{item.stock}</div>
                <div className="text-lg text-gray-600 text-center">{item.expiry}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
