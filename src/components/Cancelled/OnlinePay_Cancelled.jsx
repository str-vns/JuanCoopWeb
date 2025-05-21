import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OnlinePayRefund = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cancelledData, others } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === "paymaya") {
      navigate("/paymaya_cancelled", { state: { paymentMethod: method, cancelledData, others } });
    } else if (method === "gcash") {
      navigate("/gcash_cancelled", { state: { paymentMethod: method, cancelledData, others } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Choose Payment Method</h1>

      <button
        className="w-64 py-3 mb-4 bg-blue-700 text-white font-semibold rounded-lg shadow-md transition hover:bg-blue-800"
        onClick={() => handleSelectPaymentMethod("paymaya")}
      >
        Paymaya
      </button>

      <button
        className="w-64 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition hover:bg-blue-600"
        onClick={() => handleSelectPaymentMethod("gcash")}
      >
        Gcash
      </button>
    </div>
  );
};

export default OnlinePayRefund;
