import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { updateWithdraw } from "@redux/Actions/transactionActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useSocket } from "../../../../SocketIo";
import Sidebar from "../sidebar";

const RefundDetailsAdmin = () => {
  const location = useLocation();
  const trans = location.state?.refundData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalAction, setModalAction] = useState(null); // Track the action (approve/decline)

  useEffect(() => {
    const fetchJwt = () => {
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
        title: "Refund Success",
        content: `Hi! ${trans?.user?.firstName}, your refund request of ₱${
          trans?.amount?.toFixed(2) || "0.00"
        } has been processed.`,
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
      navigate("/RefundSuccessAdmin", { replace: true }); // Navigate back and refresh
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
        title: "Refund Declined",
        content: `Hi! ${trans?.user?.firstName}, your refund request has been declined. Please contact the admin for more information.`,
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
      navigate("/RefundSuccessAdmin", { replace: true }); // Navigate back and refresh
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
    <div className="container mx-auto p-6">
      <Sidebar />
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-2xl font-bold">Refund Details</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg font-semibold">
          {trans?.user?.firstName} {trans?.user?.lastName}
        </p>
        <p>ID: {trans?._id}</p>
        <p>Payment Method: {trans?.paymentMethod}</p>
        <p>Account Name: {trans?.accountName}</p>
        <p>Phone Number: {trans?.accountNumber}</p>
        <p>Date: {new Date(trans?.date).toLocaleDateString()}</p>
        <p>Amount: ₱{trans?.amount?.toFixed(2) || "0.00"}</p>
        <p>
          <strong>Transaction Status:</strong>{" "}
          <span
            className={`text-${
              trans?.transactionStatus === "SUCCESS"
                ? "green-600"
                : trans?.transactionStatus === "PENDING"
                ? "orange-500"
                : "red-600"
            }`}
          >
            {trans?.transactionStatus}
          </span>
        </p>
        <p>
          <strong>Reason for Refund:</strong>{" "}
          {trans?.cancelledId?.content || (
            <span className="text-red-500">No reason provided.</span>
          )}
        </p>
      </div>

      {trans?.transactionStatus === "PENDING" && (
        <div className="flex space-x-4 mt-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => openConfirmationModal("approve")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve Refund"}
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => openConfirmationModal("decline")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Decline Refund"}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="font-bold">Confirmation</h3>
            <p>
              Are you sure you want to{" "}
              {modalAction === "approve" ? "approve" : "decline"} this refund?
            </p>
            <div className="modal-actions">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${
                  modalAction === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
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

export default RefundDetailsAdmin;
