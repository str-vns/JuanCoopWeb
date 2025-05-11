import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus } from "@src/redux/Actions/orderActions";
import { createCancelled } from "@src/redux/Actions/cancelledActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../../../SocketIo";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { getCoop } from "@redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/refundreason.css"; //

const Client_Cancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const storedToken = getToken();
  const userId = currentUser?._id;
  const socket = useSocket();

  const { loading, coop, error } = useSelector((state) => state.singleCoop);
  const cancelled = location.state || {}; // Ensure it's always an object

  const inventoryId = cancelled?.inventoryId || null;
  const orderId = cancelled?.orderId || cancelled?.order?._id || null;
  const orderItemId = cancelled?.orderItemId || null;
  const coopUser = cancelled?.coopUser || null;

  console.log("Location State (Cancelled Data):", cancelled);
  console.log("Order Data:", cancelled.order);
  const coops = cancelled.coopUser;
  const paymentMethod =
    cancelled?.paymentMethod || cancelled?.order?.paymentMethod || null;
  console.log("Payment Method:", paymentMethod);

  const userName = currentUser?.firstName || "Unknown User";
  const lastName = currentUser?.lastName || "";

  // Debugging user details
  console.log("User Name:", userName);
  console.log("User Last Name:", lastName);
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  console.log("Selected Reason:", selectedReason);
  console.log("Other Reason:", otherReason);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const reasons = [
    "Changed my mind",
    "Found a better deal",
    "Order took too long",
    "Ordered by mistake",
    "Product no longer needed",
    "I Just Found Better Alternatives",
    "Other",
  ];

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("jwt");
        if (storedToken) setToken(storedToken);
        console.log("JWT Token:", storedToken);
      } catch (err) {
        console.error("Error retrieving JWT: ", err);
      }
    };
    fetchJwt();
    if (coops) {
      dispatch(getCoop(coops, token));
    }
  }, [coops, token]);

  const handleCancelOrder = () => {
    setIsCancelModalVisible(true); // Show the modal
  };

  const confirmCancelOrder = () => {
    setIsCancelModalVisible(false); // Hide the modal
    proceedWithCancellation(); // Proceed with cancellation
  };

  const closeCancelModal = () => {
    setIsCancelModalVisible(false); // Hide the modal
  };

  const proceedWithCancellation = () => {
    if (!currentUser) {
      alert("User profile is not available. Please try again later.");
      return;
    }

    if (selectedReason === "Other" && otherReason === "") {
      alert("Please specify your reason");
      return;
    }

    const reason = selectedReason === "Other" ? otherReason : selectedReason;
    const cancelledInfo = {
      cancelledId: orderItemId,
      cancelledBy: userId,
      content: reason,
    };
    const otherInfo = {
      coopUser: coop?.user?._id,
      fcmToken: fcmToken,
      userName: userName,
      lastName: lastName,
      inventoryProduct: inventoryId,
      orderId: orderId,
    };

    if (paymentMethod === "paymaya" || paymentMethod === "gcash") {
      console.log("Redirecting to online payment cancellation...");
      navigate("/online-pay-cancelled", {
        state: { cancelledData: cancelledInfo, others: otherInfo },
      });
    } else {
      dispatch(createCancelled(cancelledInfo, token));
      setRefresh(true);
      try {
        const status = {
          orderStatus: "Cancelled",
          inventoryProduct: inventoryId,
        };
        dispatch(updateOrderStatus(orderId, status, token));

        const notification = {
          title: "Order Cancelled",
          content: `The order has been cancelled by ${userName} ${lastName}.`,
          user: coop?.user?._id,
          fcmToken: fcmToken,
          type: "order",
        };

        socket.emit("sendNotification", {
          senderName: userName,
          receiverName: coop?.user?._id,
          type: "order",
        });
        dispatch(sendNotifications(notification, token));

        alert("Your order has been successfully cancelled.");
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert(
          "An error occurred while cancelling your order. Please try again."
        );
      } finally {
        setRefresh(false);
        navigate(-1);
      }
    }
  };

  return (
    <div className="cancel-container">
      <h1 className="cancel-title">Order Cancelled</h1>
      <p className="cancel-description">Why did you cancel the order?</p>

      {reasons.map((reason, index) => (
        <button
          key={index}
          className={`cancel-reason-btn ${
            selectedReason === reason ? "cancel-selected" : ""
          }`}
          onClick={() => setSelectedReason(reason)}
        >
          {reason}
        </button>
      ))}

      {selectedReason === "Other" && (
        <textarea
          className="cancel-textarea"
          placeholder="Please specify your reason"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          rows={4}
        />
      )}

      <div className="cancel-button-group">
      <button
          className="cancel-back-btn"
          style={{ backgroundColor: "gray", color: "white" }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          className="cancel-confirm-btn"
          style={{ backgroundColor: "red", color: "white" }}
          onClick={handleCancelOrder}
        >
          Confirm
        </button>
     
      </div>

      {isCancelModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Cancellation</h2>
            <p>Do you want to cancel this order?</p>
            <div className="modal-buttons">
            <button
                className="modal-cancel-btn"
                style={{ backgroundColor: "blue", color: "white" }}
                onClick={closeCancelModal}
              >
                Back
              </button>
              <button
                className="modal-ok-btn"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={confirmCancelOrder}
              >
               Cancel
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client_Cancelled;
