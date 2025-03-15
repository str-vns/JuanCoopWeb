import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getWallet } from "@redux/Actions/walletActions";
import AuthGlobal from "@redux/Store/AuthGlobal";

const GcashRefund = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const { loading, wallet, error } = useSelector((state) => state.getWallet);

  const { paymentMethod, cancelledData, others } = location.state || {};

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const userId = context?.stateUser?.userProfile?._id;
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = localStorage.getItem("jwt");
        if (res) {
          setToken(res);
        } else {
          alert("Error: Unable to retrieve authentication token.");
        }
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
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
    if (!name || !phone) {
      alert("Please fill in all fields.");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must start with '09' and be exactly 11 digits long.");
      return;
    }

    if (window.confirm("Are you sure you want to proceed with payment?")) {
      const paymentData = {
        name,
        phone,
      };
      navigate("/confirm_cancelled", {
        state: { paymentMethod, cancelledData, paymentData, others },
      });
    }
  };

  return (
    <div style={styles.container}>
  <div style={styles.card}>
    <label style={styles.label}>Name:</label>
    <input
      type="text"
      style={styles.input}
      placeholder="Enter your full name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <label style={styles.label}>Phone Number:</label>
    <input
      type="text"
      style={styles.input}
      placeholder="Enter your phone number"
      value={phone}
      onChange={(e) => {
        let formattedText = e.target.value.replace(/[^0-9]/g, "");
        if (!formattedText.startsWith("09")) {
          formattedText = "09";
        }
        if (formattedText.length > 11) {
          formattedText = formattedText.slice(0, 11);
        }
        setPhone(formattedText);
      }}
      maxLength={11}
    />

    <button style={styles.button} onClick={handleConfirm}>
      Confirm
    </button>
  </div>
</div>
  );
};
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#FFFFFF",
  },
  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    width: "350px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ced4da",
    borderRadius: "5px",
    fontSize: "14px",
    marginBottom: "15px",
    transition: "border 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

styles.input[":focus"] = {
  border: "1px solid #007bff",
  outline: "none",
};

styles.button[":hover"] = {
  background: "#0056b3",
};



export default GcashRefund;