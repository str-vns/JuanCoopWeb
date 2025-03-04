import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { thisMonthDelivery, removeDelivery } from "@redux/Actions/deliveryActions";
import "@assets/css/riderdelivery.css";
import Sidebar from "../sidebar";

const RiderDelivery = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const driverId = location.state?.driver;
  const userId = driverId?._id;

  const { Deliveryloading, deliveries, Deliveryerror } = useSelector((state) => state.deliveryList);
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token && userId) {
      dispatch(thisMonthDelivery(userId, token));
    }
  }, [userId, dispatch, token]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#FFA500",
      delivering: "#007BFF",
      cancelled: "#DC3545",
      "re-deliver": "#6F42C1",
      failed: "#DC3545",
      delivered: "#28A745",
    };
    return colors[status] || "#333";
  };

  const capitalize = (text) => text?.charAt(0).toUpperCase() + text.slice(1);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(thisMonthDelivery(userId, token)).finally(() => setRefreshing(false));
  }, [userId, token]);

  return (
    <div className="rider-assign-container">
      <Sidebar />
      <div className="rider-assign-header">
        <h1>Assigned Deliveries</h1>
      </div>

      {deliveries?.length ? (
        <div className="rider-info">
          <img
            src={deliveries[0]?.assignedTo?.image?.url || "/default-avatar.png"}
            alt="Rider"
            className="rider-profile-image"
          />
          <div>
            <p className="rider-name-title">Rider Name:</p>
            <p className="rider-name">
              {deliveries[0]?.assignedTo?.firstName} {deliveries[0]?.assignedTo?.lastName}
            </p>
          </div>
        </div>
      ) : (
        <p className="no-deliveries">No deliveries assigned yet.</p>
      )}

      <div className="order-list">
        {deliveries?.map((item) => (
          <div key={item._id} className="order-item">
            <p className="delivery-text">Delivery ID: <span>{item._id}</span></p>
            <p className="delivery-text">Order ID: <span>{item.orderId}</span></p>

            <div className="button-row">
              <button
                className="order-button"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {capitalize(item.status)}
              </button>

              <button className="trash-button" onClick={() => dispatch(removeDelivery(item._id, token))}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiderDelivery;