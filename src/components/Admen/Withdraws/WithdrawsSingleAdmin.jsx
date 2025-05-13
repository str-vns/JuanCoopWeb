import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { updateWithdraw } from "@redux/Actions/transactionActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useSocket } from "../../../../SocketIo";
import "@assets/css/withdrawAdmin.css";

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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalAction, setModalAction] = useState(null); // Track the action (approve/decline)

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

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      const transData = {
        transactionStatus: "SUCCESS",
        fcmToken: fcmToken,
      };
      await dispatch(updateWithdraw(trans?._id, transData, token));

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

      await dispatch(sendNotifications(notification, token));
      navigate("/withdrawlistAdmin", { replace: true }); // Navigate back and refresh
    } finally {
      setIsLoading(false);
      setIsModalOpen(false); // Close the modal
    }
  };

  const handleDecline = async () => {
    try {
      setIsLoading(true);
      const transData = {
        transactionStatus: "FAILED",
        fcmToken: fcmToken,
      };
      await dispatch(updateWithdraw(trans?._id, transData, token));

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

      await dispatch(sendNotifications(notification, token));
      navigate("/withdrawlistAdmin", { replace: true }); // Navigate back and refresh
    } finally {
      setIsLoading(false);
      setIsModalOpen(false); // Close the modal
    }
  };

  const openConfirmationModal = (action) => {
    setModalAction(action);
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="withdraw-details-container">
      <Sidebar />
      <div className="withdraw-details-header">
        <h2>Withdrawal Details</h2>
      </div>

      <div className="withdraw-details-card">
        <p className="withdraw-details-user">
          {trans?.user?.firstName} {trans?.user?.lastName}
        </p>
        <p>
          <strong>ID:</strong> {trans?._id}
        </p>
        <p>
          <strong>Payment Method:</strong> {trans?.paymentMethod}
        </p>
        <p>
          <strong>Account Name:</strong> {trans?.accountName}
        </p>
        <p>
          <strong>Phone Number:</strong> {trans?.accountNumber}
        </p>
        <p>
          <strong>Date:</strong> {new Date(trans?.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Amount:</strong> ₱{trans?.amount}
        </p>
        <p className="withdraw-details-status">
          <strong>Transaction Status:</strong>
          <span
            className={`withdraw-details-status-${trans?.transactionStatus?.toLowerCase()}`}
          >
            {trans?.transactionStatus}
          </span>
        </p>
      </div>

      {trans?.transactionStatus === "PENDING" && (
        <div className="withdraw-details-actions">
          <button
            className="withdraw-details-approve"
            onClick={() => openConfirmationModal("approve")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve Withdrawal"}
          </button>

          <button
            className="withdraw-details-decline"
            onClick={() => openConfirmationModal("decline")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Decline"}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmation</h3>
            <p>
              Are you sure you want to{" "}
              {modalAction === "approve" ? "approve" : "decline"} this withdrawal?
            </p>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={
                  modalAction === "approve"
                    ? "confirm-approve-button"
                    : "confirm-decline-button"
                }
                onClick={
                  modalAction === "approve" ? handleApprove : handleDecline
                }
              >
                {modalAction === "approve" ? "Approve" : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawsSingleAdmin;