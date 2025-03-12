import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";

const OnlineNext = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
          <Navbar />
      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 text-center mt-2">
          Your online payment has been successfully completed
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all"
        >
          Next Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default OnlineNext;