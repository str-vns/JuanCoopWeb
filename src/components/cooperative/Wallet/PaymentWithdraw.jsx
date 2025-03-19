import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import "@assets/css/paymentwithdraw.css";

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
    <div className="payment-withdraw">
      <Sidebar />
      <div className="payment-withdraw__container">
        <h1>Choose Withdraw Method</h1>

        <button
          onClick={() => handleSelectPaymentMethod("paymaya")}
          className="payment-withdraw__button payment-withdraw__button--paymaya"
        >
          PayMaya
        </button>

        <button
          onClick={() => handleSelectPaymentMethod("gcash")}
          className="payment-withdraw__button payment-withdraw__button--gcash"
        >
          GCash
        </button>
      </div>
    </div>
  );
};

export default PaymentWithdraw;