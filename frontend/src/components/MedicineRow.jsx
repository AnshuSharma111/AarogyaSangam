import React from "react";
import { Trash } from 'lucide-react';
const MedicineRow = ({ index, medicine, handleChange, removeRow }) => {
  return (
    <div className="flex gap-4 mb-4 items-center">
      <input
        type="text"
        name="medicineName"
        value={medicine.medicineName}
        placeholder="Medicine Name"
        onChange={(e) => handleChange(index, e)}
        className="border px-2 py-1 rounded w-1/4"
      />
      <input
        type="text"
        name="medicineId"
        value={medicine.medicineId}
        placeholder="Medicine ID"
        onChange={(e) => handleChange(index, e)}
        className="border px-2 py-1 rounded w-1/4"
      />
      <input
        type="number"
        name="quantity"
        value={medicine.quantity}
        placeholder="Quantity"
        onChange={(e) => handleChange(index, e)}
        className="border px-2 py-1 rounded w-1/6"
      />
      <input
        type="number"
        name="price"
        value={medicine.price}
        placeholder="Price"
        onChange={(e) => handleChange(index, e)}
        className="border px-2 py-1 rounded w-1/6"
      />
      <span className="w-1/6 text-center">{medicine.total}</span>
      <button
        onClick={() => removeRow(index)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        <Trash/>
      </button>
    </div>
  );
};

export default MedicineRow;
