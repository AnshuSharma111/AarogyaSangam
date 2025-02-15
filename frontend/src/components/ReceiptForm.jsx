import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MedicineRow from "./MedicineRow";
import { useAuth } from "./AuthContext";

const API_OTP = "http://localhost:5000/api/receipt/generate";
const API_VERIFY_OTP = "http://localhost:5000/api/receipt/verify";

const ReceiptForm = () => {
    const { username } = useAuth();

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
    
    // New state for OTP functionality
    const [otpState, setOtpState] = useState({
        isOtpSent: false,
        isOtpVerified: false,
        otp: "",
        resendCount: 0,
        showOtpInput: false
    });

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

    // New OTP related functions
    const handleOtpChange = (e) => {
        setOtpState(prev => ({
            ...prev,
            otp: e.target.value
        }));
    };

    const handleSendOtp = async () => {
        if (!customerDetails.customerPhone || customerDetails.customerPhone.trim() === "") {
            setErrorMessage("Please enter a valid phone number.");
            return;
        }
    
        if (medicines.length === 0 || medicines.some(med => !med.medicineName.trim())) {
            setErrorMessage("Please enter at least one medicine name.");
            return;
        }
    
        try {
            const requestBody = {
                medicines: medicines.map((med) => ({
                    name: med.medicineName,
                    quantity: med.quantity,
                  })),
                  recipient: customerDetails.customerPhone,
            };
    
            console.log("Request Payload:", requestBody); // Debugging
    
            const response = await fetch(API_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
    
            if (response.ok) {
                setOtpState(prev => ({
                    ...prev,
                    isOtpSent: true,
                    showOtpInput: true
                }));
                setErrorMessage("");
            } else {
                 // Get more details from the server
                setErrorMessage("Failed to send OTP");
            }
        } catch (error) {
            setErrorMessage("Error sending OTP. Please try again.");
            console.error("Send OTP Error:", error);
        }
    };
    
    const handleResendOtp = async () => {
        if (otpState.resendCount >= 3) {
            setErrorMessage("Maximum resend attempts reached. Please try again later.");
            return;
        }

        try {
            const response = await fetch(API_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    medicines: medicines.map((med) => ({
                        name: med.medicineName,
                        quantity: med.quantity,
                      })),
                      recipient: customerDetails.customerPhone,
                })
            });

            if (response.ok) {
                setOtpState(prev => ({
                    ...prev,
                    resendCount: prev.resendCount + 1
                }));
                setErrorMessage("");
            } else {
                setErrorMessage("Failed to resend OTP. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Error resending OTP. Please try again.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpState.otp.trim()) {
            setErrorMessage("Please enter the OTP.");
            return;
        }
    
        try {
            const requestBody = {
                medicines: medicines.map((med) => ({
                    name: med.medicineName,
                    quantity: med.quantity,
                  })),
                  recipient: customerDetails.customerPhone,
                otp: otpState.otp
            };
    
            console.log("Verify OTP Payload:", requestBody); // Debugging
    
            const response = await fetch(API_VERIFY_OTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
    
            if (response.ok) {
                setOtpState(prev => ({
                    ...prev,
                    isOtpVerified: true,
                    showOtpInput: false
                }));
                setErrorMessage("");
            } else {
                const errorData = await response.json();
                setErrorMessage(`Invalid OTP: ${errorData.message}`);
            }
        } catch (error) {
            setErrorMessage("Error verifying OTP. Please try again.");
            console.error("Verify OTP Error:", error);
        }
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

        if (!otpState.isOtpVerified) {
            setErrorMessage("Please verify OTP first.");
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
        doc.text("Aarogya Sanagam Medical Receipt", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Receipt Number: ${receiptNumber}`, 20, 30);
        doc.text(`Chemist ID: ${username}`, 150, 30);

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
                        Chemist Id: {username || "Not Available"}
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
                
                {/* OTP Section */}
                <div className="mt-6">
                    {!otpState.isOtpVerified && (
                        <>
                            <button
                                onClick={otpState.isOtpSent ? handleVerifyOtp : handleSendOtp}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                disabled={!customerDetails.customerPhone}
                            >
                                {otpState.isOtpSent ? "Verify OTP" : "Send OTP"}
                            </button>
                            
                            {otpState.showOtpInput && (
                                <>
                                    <input
                                        type="text"
                                        value={otpState.otp}
                                        onChange={handleOtpChange}
                                        placeholder="Enter OTP"
                                        className="border px-2 py-1 rounded mx-2"
                                    />
                                    {otpState.resendCount < 3 && (
                                        <button
                                            onClick={handleResendOtp}
                                            className="bg-gray-500 text-white px-4 py-2 rounded"
                                        >
                                            Resend OTP ({3 - otpState.resendCount} attempts left)
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

                {errorMessage && (
                    <p className="text-red-500 font-medium mt-4">{errorMessage}</p>
                )}
                
                <button
                    onClick={generatePDF}
                    className={`bg-green-500 text-white px-4 py-2 rounded mt-4 ${
                        !otpState.isOtpVerified ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!otpState.isOtpVerified}
                >
                    Generate Receipt
                </button>
            </div>
        </div>
    );
};

export default ReceiptForm;