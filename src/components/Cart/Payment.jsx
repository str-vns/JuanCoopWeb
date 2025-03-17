import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "@assets/css/checkout.css";
import Navbar from "../layout/navbar";
import { toast } from "react-toastify";
import { addPay } from "@redux/Actions/paymentActions";
import { useDispatch } from "react-redux";
import { addPaymentData } from "@redux/Actions/paymentActions";

const unSuccess = "Unsuccessful_01";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (selectedPaymentMethod) {
      if (selectedPaymentMethod === "COD") {
        const data = {
          paymentMethod: selectedPaymentMethod,
        };
        dispatch(addPay(data));
        dispatch(addPaymentData({}));
        navigate("/checkout");
      } else if (selectedPaymentMethod === "gcash") {
        const data = {
          paymentMethod: selectedPaymentMethod,
        };
        dispatch(addPay(data));
        navigate("/gcash");
      } else if (selectedPaymentMethod === "paymaya") {
        const data = {
          paymentMethod: selectedPaymentMethod,
        };
        dispatch(addPay(data));
        navigate("/paymaya");
      } else {
        toast.error("Please select a Payment Method to proceed.", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: unSuccess,
          closeButton: false,
        });
      }
    } else {
      toast.error("Please select a Payment Method to proceed.", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: unSuccess,
        closeButton: false,
      });
    }
  };

  return (
    <div className="checkout-container">
      <Navbar />
      {/* <h2 className="checkout-title">Payment Methods</h2> */}

      <div className="section">
         <div className="payment-list-header">
            <h1>Mode of Payment</h1>
           
          </div>
        <div>
          <div className="address-container">
            {/* Cash on Delivery (COD) Option */}
            <label
              className={`address-box ${
                selectedPaymentMethod === "COD" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value="COD"
                checked={selectedPaymentMethod === "COD"}
                onChange={() => setSelectedPaymentMethod("COD")}
              />
              <div className="address-details">
                <p>
                  <strong>Cash on Delivery</strong>
                </p>
                <p>Pay when you receive your order.</p>
              </div>
            </label>

            {/* Online Payment Option */}
            <label
              className={`address-box ${
                selectedPaymentMethod === "Gcash" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value="Gcash"
                checked={selectedPaymentMethod === "gcash"}
                onChange={() => {
                  setSelectedPaymentMethod("gcash");
                }}
              />
              <div className="address-details">
                <p>
                  <strong>Gcash</strong>
                </p>
                <p>Pay securely with Gcash</p>
              </div>
            </label>

            <label
              className={`address-box ${
                selectedPaymentMethod === "Paymaya" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value="Paymaya"
                checked={selectedPaymentMethod === "paymaya"}
                onChange={() => setSelectedPaymentMethod("paymaya")}
              />
              <div className="address-details">
                <p>
                  <strong>Paymaya</strong>
                </p>
                <p>Pay securely with Paymaya</p>
              </div>
            </label>
          </div>

          {/* Confirm Payment Button */}
          <div className="proceed-button-container">
            <button onClick={handleConfirmPayment} className={"proceed-button"}>
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
