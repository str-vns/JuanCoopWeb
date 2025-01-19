import React from "react";
import { useNavigate } from "react-router-dom";

import check from "../../assets/img/check.png"; // Import the check image
import Navbar from "../layout/navbar";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from '@redux/Actions/cartActions';
import { clearShip } from '@redux/Actions/shippingActions';
import { clearPay } from '@redux/Actions/paymentActions';

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payItems = useSelector((state) => state.payItems);
  const cartItems = useSelector((state) => state.cartItems);
  const shipItems = useSelector((state) => state.shipItems);
  
  const handleReceiptClick = () => {
    alert("Receipt button clicked!");
  };

  const handleBackToHomeClick = () => {
      dispatch(clearCart());
      dispatch(clearShip());
      dispatch(clearPay());
      navigate("/");
    alert("Navigating back to Home...");
  };

  return (
    <div style={styles.container}>
      <Navbar />
      {/* Confirmation Icon */}
      <div style={styles.iconContainer}>
        <div style={styles.circle}>
          <img
            src={check}
            alt="Order Confirmed"
            style={styles.checkImage} // Style for the image
          />
        </div>
      </div>

      {/* Text */}
      <h2 style={styles.heading}>Your Order is Confirmed</h2>
      <p style={styles.subText}>Thank you for your Order</p>

      {/* Receipt Button */}
      <button style={styles.receiptButton} onClick={handleReceiptClick}>
        Receipt
      </button>

      {/* Back to Home */}
      <p style={styles.backToHome} onClick={() => handleBackToHomeClick()}>
        Back to Home
      </p>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  iconContainer: {
    marginBottom: "20px",
  },

  checkImage: {
    display: "block", // Ensures the image behaves as a block element
    margin: "auto", // Centers the image horizontally
    width: "50%", // Controls the size of the image
    height: "auto",
  },

  heading: {
    fontSize: "24px",
    margin: "10px 0",
    color: "#000",
  },
  subText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  receiptButton: {
    backgroundColor: "#FFBF43",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  backToHome: {
    color: "#FFBF43",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default OrderConfirmation;
