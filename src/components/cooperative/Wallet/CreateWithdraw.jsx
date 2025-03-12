import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createTransaction } from "@redux/Actions//transactionActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";

const CreateWithdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const location = useLocation();
  const { paymentMethod, paymentData } = location.state || {}; // Get data from navigation state
  const [token, setToken] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setToken(jwt);
    } else {
      window.alert("Error: Unable to retrieve authentication token.");
    }
  }, []);

  const handleConfirm = async () => {
    const isConfirmed = window.confirm(
      "Your withdrawal will be processed within 1 to 5 business days. Do you want to continue?"
    );

    if (isConfirmed) {
      const transactionData = {
        user: userId,
        amount: paymentData?.amount,
        paymentMethod: paymentMethod,
        accountName: paymentData?.name,
        accountNumber: paymentData?.phone,
      };

      try {
        const transac = await dispatch(createTransaction(transactionData, token));

        if (transac === true) {
          navigate("/withdrawlist", { replace: true });
        } else {
          window.alert("Error: Failed to create transaction.");
        }
      } catch (error) {
        window.alert("Error: Something went wrong. Please try again.");
        console.error("Transaction Error:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
        <Sidebar/>
      <h2 style={styles.header}>Confirm Withdrawal</h2>
      <div style={styles.info}><strong>Name:</strong> {paymentData?.name}</div>
      <div style={styles.info}><strong>Payment Method:</strong> {paymentMethod}</div>
      <div style={styles.info}><strong>Phone Number:</strong> {paymentData?.phone}</div>
      <div style={styles.info}><strong>Amount:</strong> ₱ {paymentData?.amount}</div>

      <button style={styles.confirmButton} onClick={handleConfirm}>
        Confirm Withdraw
      </button>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  header: {
    color: "#333",
  },
  info: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#555",
  },
  confirmButton: {
    width: "100%",
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default CreateWithdraw;