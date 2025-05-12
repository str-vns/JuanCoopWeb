import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@redux/Actions//walletActions";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "@assets/css/mayaform.css";

const MayaForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const { loading, wallet, error } = useSelector((state) => state.getWallet);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("09"); // Default to "09"
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for custom confirmation dialog

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

    setShowConfirmDialog(true); // Show custom confirmation dialog
  };

  const handleConfirmDialog = (confirmed) => {
    setShowConfirmDialog(false); // Hide the dialog
    if (confirmed) {
      // Show success toast
      toast.success("Your withdrawal request has been recorded. Please proceed with confirmation.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/createwithdraw", {
        state: {
          paymentMethod: location.state.paymentMethod,
          paymentData: { name, phone, amount },
        },
      });
    }
  };

  return (
    <div className="maya-withdraw">
      <Sidebar />
      <div className="maya-withdraw__container">
        <h2 className="maya-withdraw__title">Withdraw Funds</h2>

        <label className="maya-withdraw__label">Name:</label>
        <input
          type="text"
          className="maya-withdraw__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label className="maya-withdraw__label">Phone Number:</label>
        <input
          type="tel"
          className="maya-withdraw__input"
          value={phone}
          onChange={(e) => {
            const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            if (input.startsWith("09") && input.length <= 11) setPhone(input); // Ensure it starts with "09" and is up to 11 digits
          }}
          placeholder="Enter phone number"
        />

        <label className="maya-withdraw__label">Amount:</label>
        <input
          type="number"
          className="maya-withdraw__input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <button className="maya-withdraw__button" onClick={handleConfirm}>
          Continue
        </button>
      </div>

      {/* Custom Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog">
          <div className="confirm-dialog__content">
            <p>Proceed with payment of ₱{amount}?</p>
            <div className="confirm-dialog__actions">
              <button
                className="confirm-dialog__button confirm-dialog__button--yes"
                onClick={() => handleConfirmDialog(true)}
              >
                Yes
              </button>
              <button
                className="confirm-dialog__button confirm-dialog__button--no"
                onClick={() => handleConfirmDialog(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MayaForm;