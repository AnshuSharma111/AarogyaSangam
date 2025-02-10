import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MedicineRow from "./MedicineRow";
import { useAuth } from "./AuthContext";

const ReceiptForm = () => {
    const { userId } = useAuth();
    const [customerDetails, setCustomerDetails] = useState({
        customerName: "",
        customerPhone: "",
        customerId: "",
    });

    const [medicines, setMedicines] = useState([
        { medicineName: "", medicineId: "", quantity: 0, price: 0, total: 0 },
    ]);

    const [receiptNumber, setReceiptNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        localStorage.setItem("receiptNumber", 1);
        setReceiptNumber(1);
    }, []);

    const handleCustomerChange = (e) => {
        setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    };

    const handleMedicineChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMedicines = [...medicines];
        updatedMedicines[index][name] = value;

        if (name === "quantity" || name === "price") {
            updatedMedicines[index].total =
                updatedMedicines[index].quantity * updatedMedicines[index].price;
        }

        setMedicines(updatedMedicines);
    };

    const addMedicineRow = () => {
        setMedicines([
            ...medicines,
            { medicineName: "", medicineId: "", quantity: 0, price: 0, total: 0 },
        ]);
    };

    const removeMedicineRow = (index) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines);
    };

    const calculateTotalPrice = () =>
        medicines.reduce((sum, med) => sum + med.total, 0);

    const validateForm = () => {
        if (
            !customerDetails.customerName ||
            !customerDetails.customerPhone ||
            !customerDetails.customerId
        ) {
            setErrorMessage("Please fill out all customer details.");
            return false;
        }

        for (let i = 0; i < medicines.length; i++) {
            const { medicineName, medicineId, quantity, price } = medicines[i];
            if (!medicineName || !medicineId || quantity <= 0 || price <= 0) {
                setErrorMessage(
                    `Please fill out all details for medicine row ${i + 1}.`
                );
                return false;
            }
        }

        setErrorMessage("");
        return true;
    };

    const generatePDF = () => {
        if (!validateForm()) {
            return;
        }

        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 128);
        doc.text("Medical Receipt", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Receipt Number: ${receiptNumber}`, 20, 30);
        doc.text(`User ID: ${userId}`, 150, 30);

        doc.setFontSize(12);
        doc.text(`Customer Name: ${customerDetails.customerName}`, 20, 50);
        doc.text(`Phone: ${customerDetails.customerPhone}`, 20, 60);
        doc.text(`Customer ID: ${customerDetails.customerId}`, 20, 70);

        const tableData = medicines.map((medicine, index) => [
            index + 1,
            medicine.medicineName,
            medicine.medicineId,
            medicine.quantity,
            medicine.price,
            medicine.total,
        ]);

        doc.autoTable({
            startY: 80,
            head: [["#", "Medicine Name", "Medicine ID", "Quantity", "Price", "Total"]],
            body: tableData,
            theme: "grid",
            styles: {
                fontFamily: "Montserrat",
                fontSize: 10,
                textColor: [0, 0, 0],
                fillColor: [245, 245, 245],
            },
            headStyles: {
                textColor: [255, 255, 255],
                fillColor: [0, 128, 128],
            },
            columnStyles: {
                3: { halign: "center" },
                4: { halign: "center" },
                5: { halign: "right" },
            },
        });

        doc.setFontSize(14);
        doc.setTextColor(0, 128, 0);
        doc.text(`Total Price: Rs ${calculateTotalPrice()}`, 20, doc.previousAutoTable.finalY + 20);

        doc.save(`receipt_${receiptNumber}.pdf`);

        const nextReceiptNumber = receiptNumber + 1;
        localStorage.setItem("receiptNumber", nextReceiptNumber);
        setReceiptNumber(nextReceiptNumber);
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div
                className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-2xl transform scale-105"
                style={{ transition: "transform 0.3s ease" }}
            >
                <div className="flex justify-between">
                    <h1
                        className="text-3xl font-bold mb-4"
                        style={{ fontFamily: "Montserrat" }}
                    >
                        Aarogya Sangam Receipt Generator
                    </h1>
                    <p
                        className="text-sm text-gray-700"
                        style={{ fontFamily: "Poppins" }}
                    >
                        User ID: {userId}
                    </p>
                </div>
                <div className="mb-6">
                    <h2 className="font-semibold mb-2 text-xl" style={{ fontFamily: "Poppins" }}>
                        Customer Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="customerName"
                            value={customerDetails.customerName}
                            placeholder="Customer Name"
                            onChange={handleCustomerChange}
                            className="border px-2 py-1 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            name="customerPhone"
                            value={customerDetails.customerPhone}
                            placeholder="Phone Number"
                            onChange={handleCustomerChange}
                            className="border px-2 py-1 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            name="customerId"
                            value={customerDetails.customerId}
                            placeholder="Customer ID"
                            onChange={handleCustomerChange}
                            className="border px-2 py-1 rounded w-full"
                        />
                    </div>
                </div>
                <h2 className="font-semibold mb-2 text-xl" style={{ fontFamily: "Poppins" }}>
                    Medicine Details
                </h2>
                {medicines.map((medicine, index) => (
                    <MedicineRow
                        key={index}
                        index={index}
                        medicine={medicine}
                        handleChange={handleMedicineChange}
                        removeRow={removeMedicineRow}
                    />
                ))}
                <button
                    onClick={addMedicineRow}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Medicine
                </button>
                <h3 className="font-bold text-lg mt-6">Total Price: ₹{calculateTotalPrice()}</h3>
                {errorMessage && (
                    <p className="text-red-500 font-medium mt-4">{errorMessage}</p>
                )}
                <button
                    onClick={generatePDF}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                    Generate Receipt
                </button>
            </div>
        </div>
    );
};

export default ReceiptForm;
