import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { updateWithdraw } from "@redux/Actions/transactionActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useSocket } from "../../../../SocketIo";
import "@assets/css/withdrawAdmin.css"; //

import Sidebar from "../sidebar";

const WithdrawsSingleAdmin = () => {
  const location = useLocation();
  const trans = location.state?.withdrawData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = localStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const handleApprove = async (transId) => {
    if (window.confirm("Did You Send the Money to the User?")) {
      try {
        setIsLoading(true);
        const transData = {
          transactionStatus: "SUCCESS",
          fcmToken: fcmToken,
        };
        dispatch(updateWithdraw(transId, transData, token));

        const notification = {
          title: `Withdraw Success`,
          content: `Hi! ${trans?.user?.firstName}, your withdrawal request of ₱${trans?.amount?.toFixed(2) || "0.00"} has been sent to your ${trans?.paymentMethod}. Please check your account.`,
          user: trans?.user?._id,
          fcmToken: fcmToken,
          type: "order",
        };

        socket.emit("sendNotification", {
          senderName: "Admin",
          receiverName: trans?.user?._id,
          type: "order",
        });

        dispatch(sendNotifications(notification, token));
        navigate("/withdrawlistAdmin");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (transId) => {
    if (window.confirm("Are you sure you want to decline this withdrawal?")) {
      try {
        setIsLoading(true);
        const transData = {
          transactionStatus: "FAILED",
          fcmToken: fcmToken,
        };
        dispatch(updateWithdraw(transId, transData, token));

        const notification = {
          title: `Withdraw Failed`,
          content: `Hi! ${trans?.user?.firstName}, your withdrawal request has been declined. Please contact the admin for more information.`,
          user: trans?.user?._id,
          fcmToken: fcmToken,
          type: "order",
        };

        socket.emit("sendNotification", {
          senderName: "Admin",
          receiverName: trans?.user?._id,
          type: "order",
        });

        dispatch(sendNotifications(notification, token));
        navigate("/withdraws-list");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
<div className="withdraw-details-container">
  <Sidebar/>
  <div className="withdraw-details-header">
    <h2>Withdrawal Details</h2>
  </div>

  <div className="withdraw-details-card">
    <p className="withdraw-details-user">{trans?.user?.firstName} {trans?.user?.lastName}</p>
    <p><strong>ID:</strong> {trans?._id}</p>
    <p><strong>Payment Method:</strong> {trans?.paymentMethod}</p>
    <p><strong>Account Name:</strong> {trans?.accountName}</p>
    <p><strong>Phone Number:</strong> {trans?.accountNumber}</p>
    <p><strong>Date:</strong> {new Date(trans?.date).toLocaleDateString()}</p>
    <p><strong>Amount:</strong> ₱{trans?.amount}</p>
    <p className="withdraw-details-status">
      <strong>Transaction Status:</strong> 
      <span className={`withdraw-details-status-${trans?.transactionStatus?.toLowerCase()}`}>
        {trans?.transactionStatus}
      </span>
    </p>
  </div>

  {trans?.transactionStatus === "PENDING" && (
    <div className="withdraw-details-actions">
      <button 
        className="withdraw-details-approve" 
        onClick={() => handleApprove(trans?._id)} 
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Approve Withdrawal"}
      </button>

      <button 
        className="withdraw-details-decline" 
        onClick={() => handleDelete(trans?._id)} 
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Decline"}
      </button>
    </div>
  )}
</div>




  );
};

export default WithdrawsSingleAdmin;