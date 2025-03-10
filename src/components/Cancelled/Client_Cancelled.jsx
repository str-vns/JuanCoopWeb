import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus } from "@src/redux/Actions/orderActions";
import { createCancelled } from "@src/redux/Actions/cancelledActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getCoop } from "@redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";

const ClientCancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();

  // Extract order details safely
  const cancelled = location.state || {};

  const inventoryId = cancelled?.inventoryId || null;
  const orderId = cancelled?.orderId || cancelled?.order?._id || null;
  const orderItemId = cancelled?.orderItemId || null;
  const coopUser = cancelled?.coopUser || null;

  const currentUser = getCurrentUser();
  const userId = currentUser?._id || null;

  const { loading, coop, error } = useSelector((state) => state.singleCoop);

  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [token, setToken] = useState(null);

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
        const storedToken = localStorage.getItem("jwt");
        if (storedToken) {
          setToken(storedToken);
          if (coopUser) {
            dispatch(getCoop(coopUser, storedToken));
          }
        } else {
          console.error("JWT Token not found.");
        }
      } catch (err) {
        console.error("Error retrieving JWT: ", err);
      }
    };
    fetchJwt();
  }, [coopUser, dispatch]);

  const handleCancelOrder = async () => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    if (!userId) {
      alert("User profile is not available. Please log in again.");
      navigate("/login");
      return;
    }

    if (!orderId) {
      alert("Order ID is missing. Please try again.");
      return;
    }

    if (!orderItemId) {
      alert("Order Item ID is missing. Cannot process cancellation.");
      return;
    }

    if (!inventoryId) {
      alert("Inventory ID is missing. Cannot update order status.");
      return;
    }

    const cancelReason = selectedReason === "Other" ? otherReason : selectedReason;

    const cancelData = {
      cancelledId: orderItemId,
      cancelledBy: userId,
      content: cancelReason,
    };

    try {
      // Dispatch the cancellation action
      await dispatch(createCancelled(cancelData, getToken()));

      // Update the order status to "Cancelled"
      const statusUpdate = {
        orderStatus: "Cancelled",
        inventoryProduct: inventoryId, // Ensure inventoryId is passed correctly
      };

      await dispatch(updateOrderStatus(orderId, statusUpdate));

      alert("Your order has been successfully cancelled.");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      alert("Failed to cancel the order.");
      console.error("Cancellation Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order Cancellation</h2>
      <p style={styles.description}>Why do you want to cancel this order?</p>

      <div style={styles.reasonsContainer}>
        {reasons.map((reason) => (
          <button
            key={reason}
            style={{
              ...styles.reasonButton,
              ...(selectedReason === reason ? styles.selectedReason : {}),
            }}
            onClick={() => setSelectedReason(reason)}
          >
            {reason}
          </button>
        ))}
      </div>

      {selectedReason === "Other" && (
        <textarea
          style={styles.bigInput}
          placeholder="Please specify your reason"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          rows={4}
        />
      )}

      <div style={styles.buttonGroup}>
        <button style={styles.confirmButton} onClick={handleCancelOrder}>
          Confirm
        </button>
        <button style={styles.cancelButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    background: "#ffffff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  reasonsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  reasonButton: {
    padding: "10px 15px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
    color: "#333",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "14px",
  },
  selectedReason: {
    backgroundColor: "#007bff",
    color: "white",
  },
  bigInput: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  confirmButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "white",
  },
  cancelButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: "#dc3545",
    color: "white",
  },
};

export default ClientCancelled;