import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";

const PaymentWithdraw = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);

    if (method === "paymaya") {
      navigate("/mayawithdraw", { state: { paymentMethod: method } });
    } else if (method === "gcash") {
      navigate("/gcashwithdraw", { state: { paymentMethod: method } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <Sidebar/>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Choose Payment Method</h1>
      
      <button
        onClick={() => handleSelectPaymentMethod("paymaya")}
        className="w-64 py-3 text-lg font-semibold text-white bg-blue-800 rounded-lg shadow-md hover:bg-blue-900 transition mb-4"
      >
        Paymaya
      </button>
      
      <button
        onClick={() => handleSelectPaymentMethod("gcash")}
        className="w-64 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Gcash
      </button>
    </div>
  );
};

export default PaymentWithdraw;