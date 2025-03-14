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

        dispatch(sendNotifications(notification, token));
        navigate("/refunds-list");
      } finally {
        setIsLoading(false);
      }
    }
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
        <p>Reason for Refund: {trans?.cancelledId?.content}</p>
      </div>

      {trans?.transactionStatus === "PENDING" && (
        <div className="flex space-x-4 mt-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => handleApprove(trans?._id)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve Refund"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RefundDetailsAdmin;
