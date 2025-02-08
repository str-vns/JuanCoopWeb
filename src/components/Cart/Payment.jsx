import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "@assets/css/checkout.css";
import Navbar from "../layout/navbar";
import { toast } from "react-toastify";
import { addPay } from '@redux/Actions/paymentActions';
import { useDispatch } from "react-redux";
const unSuccess = "Unsuccessful_01";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if(selectedPaymentMethod){
      const data = {
        paymentMethod: selectedPaymentMethod
      }
      dispatch(addPay(data));
      navigate("/checkout"); 
    }else {
       toast.error("Please select a Payment Method to proceed.",
              {
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
            }
            );
    }


  };

  return (
    <div className="checkout-container">
    <Navbar />
    {/* <h2 className="checkout-title">Payment Methods</h2> */}
  
    <div className="section">
      <div>
        <div className="address-container">
          {/* Cash on Delivery (COD) Option */}
          <label
            className={`address-box ${selectedPaymentMethod === "COD" ? "selected" : ""}`}
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
            className={`address-box ${selectedPaymentMethod === "Credit Card" ? "selected" : ""}`}
          >
            <input
              type="radio"
              name="payment-method"
              value="Credit Card"
              checked={selectedPaymentMethod === "Credit Card"}
              onChange={() => setSelectedPaymentMethod("Credit Card")}
            />
            <div className="address-details">
              <p>
                <strong>Online Payment</strong>
              </p>
              <p>Pay securely with credit card, PayPal, or other methods.</p>
            </div>
          </label>
        </div>
  
        {/* Confirm Payment Button */}
        <div className="proceed-button-container">
          <button
            onClick={handleConfirmPayment}
            className={"proceed-button"}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Payment;
