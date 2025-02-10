import React, { useState } from "react";

const LoginPage = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ userId: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { userId, password } = credentials;

        // Hardcoded credentials for simplicity
        if (userId === "admin" && password === "password123") {
            onLoginSuccess(); // Call the function passed as a prop
        } else {
            setError("Invalid User ID or Password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <form
                onSubmit={handleSubmit}
                className=" p-8 rounded-[20px] bg-white shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "Montserrat" }}>Login</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    name="userId"
                    value={credentials.userId}
                    placeholder="User ID"
                    style={{ fontFamily: "Poppins" }}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full mb-4"
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    style={{ fontFamily: "Poppins" }}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full" 
                    style={{ fontFamily: "Poppins" }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
