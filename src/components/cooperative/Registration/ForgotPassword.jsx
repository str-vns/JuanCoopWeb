import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = (e) => {
    e.preventDefault();

    // Replace this with your actual API call
    console.log("Forgot password request for:", email);
    setMessage("If this email exists, a reset link will be sent.");
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg ">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400 focus:outline-none"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="text-green-500 text-center mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;