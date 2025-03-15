import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@redux/actions/orderActions";
import { createCancelled } from "@redux/actions/cancelledActions";
import { useSocket } from "../../../SocketIo";
import { sendNotifications } from "@redux/actions/notificationActions";

const ConfirmCancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const socket = useSocket();
  const userId = context?.stateUser?.userProfile?._id;
  const { paymentMethod, paymentData, cancelledData, others } = location.state;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setToken(jwt);
    } else {
      alert("Error: Unable to retrieve authentication token.");
    }
  }, []);

  const handleCancelled = async () => {
    try {
      const cancel = {
        cancelledId: cancelledData?.cancelledId,
        cancelledBy: cancelledData?.cancelledBy,
        content: cancelledData?.content || "No reason provided",
      };
      const cancellation = await dispatch(createCancelled(cancel, token));

      const status = {
        orderStatus: "Cancelled",
        inventoryProduct: others?.inventoryProduct,
        paymentMethod: paymentMethod,
        accountName: paymentData?.name,
        accountNumber: paymentData?.phone,
        cancelledId: cancellation?._id,
      };
      dispatch(updateOrderStatus(others?.orderId, status, token));

      const notification = {
        title: "Order Cancelled",
        content: `The order has been cancelled by the User ${others?.userName} ${others?.lastName}.`,
        user: others?.coopUser,
        fcmToken: others?.fcmToken,
        type: "order",
      };

      socket.emit("sendNotification", {
        senderName: others?.userName,
        receiverName: others?.coopUser,
        type: "order",
      });

      dispatch(sendNotifications(notification, token));
      alert("Your order has been successfully cancelled.");
      navigate("/orders");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleConfirm = () => {
    if (window.confirm("Your withdrawal will be processed within 1 to 5 business days. Do you want to continue?")) {
      handleCancelled();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Confirm Cancellation</h2>

        <div className="mb-4">
          <p className="text-gray-600 font-semibold">Name:</p>
          <p className="text-gray-800">{paymentData?.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 font-semibold">Payment Method:</p>
          <p className="text-gray-800">{paymentMethod}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 font-semibold">Phone Number:</p>
          <p className="text-gray-800">{paymentData?.phone}</p>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 font-semibold">Cancellation Reason:</p>
          <p className="text-gray-800">{cancelledData?.content}</p>
        </div>

        <button onClick={handleConfirm} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmCancelled;
