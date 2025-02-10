import React, { useState } from "react";
import ReceiptForm from "../components/ReceiptForm";
import LoginPage from "../components/LoginPage";

const MedicineReceipt = () => {
    // State to manage whether the user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to handle login success
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <div>
            {isAuthenticated ? (
                // Render ReceiptForm if authenticated
                <ReceiptForm />
            ) : (
                // Render LoginPage and pass handleLoginSuccess as a prop
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default MedicineReceipt;
