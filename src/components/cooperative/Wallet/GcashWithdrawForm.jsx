import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@redux/Actions//walletActions";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";
import "@assets/css/gcashform.css";

const GcashWithdrawForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, wallet, error } = useSelector((state) => state.getWallet);
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchJwt = async () => {
      const res = localStorage.getItem("jwt");
      if (res) setToken(res);
      else alert("Error: Unable to retrieve authentication token.");
    };
    fetchJwt();
  }, []);

  useEffect(() => {
    if (userId && token) dispatch(getWallet(userId, token));
  }, [userId, token, dispatch]);

  const handleConfirm = () => {
    if (!name.trim() || !phone || !amount) {
      alert("Please fill in all fields correctly.");
      return;
    }
    if (!/^09\d{9}$/.test(phone)) {
      alert("Phone number must start with '09' and be exactly 11 digits long.");
      return;
    }
    if (wallet?.balance === 0 || amount > wallet?.balance) {
      alert("Insufficient Balance.");
      setAmount(wallet?.balance.toString());
      return;
    }

    if (window.confirm(`Proceed with payment of ₱${amount}?`)) {
      navigate("/createwithdraw", { state: { paymentMethod: location.state.paymentMethod, paymentData: { name, phone, amount } } });
    }
  };

  return (
    <div className="gcash-withdraw">
      <Sidebar />
      <div className="gcash-withdraw__container">
        <h2 className="gcash-withdraw__title">Withdraw Funds</h2>

        <label className="gcash-withdraw__label">Name:</label>
        <input
          type="text"
          className="gcash-withdraw__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label className="gcash-withdraw__label">Phone Number:</label>
        <input
          type="tel"
          className="gcash-withdraw__input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />

        <label className="gcash-withdraw__label">Amount:</label>
        <input
          type="number"
          className="gcash-withdraw__input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <button className="gcash-withdraw__button" onClick={handleConfirm}>
          Confirm Withdrawal
        </button>
      </div>
    </div>
  );
};

export default GcashWithdrawForm;