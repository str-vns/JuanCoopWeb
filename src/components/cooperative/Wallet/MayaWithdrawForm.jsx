import React, { useEffect, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@redux/Actions//walletActions";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";

const MayaForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const { loading, wallet, error } = useSelector((state) => state.getWallet);

 

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Sidebar/>
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <label className="block font-bold">Name:</label>
        <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="block font-bold mt-2">Phone Number:</label>
        <input type="tel" className="w-full p-2 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label className="block font-bold mt-2">Amount:</label>
        <input type="number" className="w-full p-2 border rounded" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <button className="w-full mt-4 p-2 bg-blue-500 text-white rounded" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default MayaForm;