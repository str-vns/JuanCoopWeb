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
  const [phoneError, setPhoneError] = useState("");
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

  const validatePhone = (value) => {
    if (!value) return "Phone number is required.";
    if (!/^09\d{9}$/.test(value)) return "Phone number must start with '09' and be exactly 11 digits.";
    return "";
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhone(val);
    setPhoneError(validatePhone(val));
  };

  const handleConfirm = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Validation Error: Please fill in all fields.");
      return;
    }

    const phoneValidation = validatePhone(phone);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }

    if (window.confirm("Are you sure you want to proceed with payment?")) {
      const reason = cancelledData?.content || "No reason provided";
      const paymentData = { name, phone, reason };

      navigate("/confirm_cancelled", {
        state: {
          paymentMethod,
          cancelledData: { ...cancelledData, content: reason }, // ensure content is set
          paymentData,
          others,
        },
      });
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>PayMaya Refund Details</h2>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label htmlFor="name" style={{ fontWeight: "bold" }}>Full Name:</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />

        <label htmlFor="phone" style={{ fontWeight: "bold" }}>Phone Number:</label>
        <input
          id="phone"
          type="text"
          placeholder="09XXXXXXXXX"
          value={phone}
          maxLength={11}
          onChange={handlePhoneChange}
          style={{ padding: 8, borderRadius: 4, border: phoneError ? "1px solid #e74c3c" : "1px solid #ccc" }}
        />
        <small style={{ color: phoneError ? "#e74c3c" : "#888" }}>
          {phoneError ? phoneError : "Enter a valid 11-digit number starting with 09"}
        </small>

        <button
          onClick={handleConfirm}
          className="confirm-button"
          style={{
            marginTop: 16,
            padding: "10px 0",
            background: "#2d8f4e",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PaymayaRefund;
