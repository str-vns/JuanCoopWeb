import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createTransaction } from "@redux/Actions//transactionActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";
import "@assets/css/confirmwithdraw.css";

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
    <div className="confirm-withdraw">
      <Sidebar />
      <div className="confirm-withdraw__container">
        <h2 className="confirm-withdraw__header">Confirm Withdrawal</h2>
        
        <div className="confirm-withdraw__info"><strong>Name:</strong> {paymentData?.name}</div>
        <div className="confirm-withdraw__info"><strong>Payment Method:</strong> {paymentMethod}</div>
        <div className="confirm-withdraw__info"><strong>Phone Number:</strong> {paymentData?.phone}</div>
        <div className="confirm-withdraw__info"><strong>Amount:</strong> ₱{paymentData?.amount}</div>

        <button className="confirm-withdraw__button" onClick={handleConfirm}>
          Confirm Withdraw
        </button>
      </div>
    </div>
  );
};

export default CreateWithdraw;