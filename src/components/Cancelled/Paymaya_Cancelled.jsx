import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@redux/Actions/walletActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useNavigate, useLocation } from "react-router-dom";

const PaymayaRefund = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  
  const { paymentMethod, cancelledData, others } = location.state || {};
  const { loading, wallet, error } = useSelector((state) => state.getWallet);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchJwt = () => {
      const res = localStorage.getItem("jwt");
      if (res) {
        setToken(res);
      } else {
        alert("Error: Unable to retrieve authentication token.");
      }
    };
    fetchJwt();
  }, []);

  useEffect(() => {
    if (userId && token) {
      dispatch(getWallet(userId, token));
    }
  }, [userId, token, dispatch]);

  const handleConfirm = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Validation Error: Please fill in all fields.");
      return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Validation Error: Phone number must start with '09' and be exactly 11 digits long.");
      return;
    }

    if (window.confirm("Are you sure you want to proceed with payment?")) {
    //   const paymentData = { name, phone };
    //   navigate("/confirm-cancelled", { state: { paymentMethod, cancelledData, paymentData, others } });
    const reason = cancelledData?.content || "No reason provided"; // Ensure reason is always passed
    const paymentData = { name, phone, reason };
    
    console.log("🚀 Navigating with:", { paymentMethod, cancelledData, paymentData, others });
    
    // navigate("/confirm-cancelled", { state: { paymentMethod, cancelledData, paymentData, others } });
    navigate("/confirm-cancelled", {
        state: {
          paymentMethod,
          cancelledData: { ...cancelledData, reason }, // Include reason in cancelledData
          paymentData,
          others,
        },
      });
}
  };

  return (
    <div className="container">
      <div className="card">
        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Phone Number:</label>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          maxLength={11}
          onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11))}
        />

        <button onClick={handleConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
  );
};

export default PaymayaRefund;
