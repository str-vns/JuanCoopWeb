// CoopHistory.jsx
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { historyDeliveryCoop } from "@redux/Actions/orderActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/coophistory.css";
import Sidebar from "../sidebar";

const statusColors = {
  delivered: "#28a745",
  delivering: "#f39c12",
  pending: "#007bff",
  failed: "#dc3545",
  "re-deliver": "#17a2b8",
};

const OrderItem = ({ order }) => (
  <div className="coop-history-order-item">
    <span className="coop-history-order-id">Order#{order._id}</span>
    <span
      className="coop-history-status-badge"
      style={{ backgroundColor: statusColors[order.status] }}
    >
      {order.status}
    </span>
  </div>
);

const Section = ({ title, data }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="coop-history-section-header" onClick={() => setExpanded(!expanded)}>
        <span className="coop-history-section-title">{title}</span>
        <span className="coop-history-toggle-symbol">{expanded ? "▾" : "▸"}</span>
      </div>
      {expanded && (
        <div className="coop-history-list">
          {data.map((order) => (
            <OrderItem key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

const CoopHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { historyloading, history, historyerror } = useSelector((state) => state.deliveredhistory);
  
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = localStorage.getItem("jwt");
      if (res) {
        setToken(res);
        if (userId) {
          dispatch(historyDeliveryCoop(userId, res));
        }
      }
    };
    fetchData();
  }, [userId, dispatch]);

  const groupOrdersByMonth = (orders) => {
    return orders.reduce((acc, order) => {
      const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
      const month = createdAt.toLocaleString("default", { month: "long" });
      const year = createdAt.getFullYear();
      const monthYear = `${month} ${year}`;

      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(order);
      return acc;
    }, {});
  };

  const groupedDeliveries = history?.length > 0 ? groupOrdersByMonth(history) : {};

  return (
    <div className="coop-history-container">
      <Sidebar/>
      <div className="coop-history-header">
        {/* <button className="coop-history-menu-button" onClick={() => navigate("/menu")}>☰</button> */}
        <h2 className="coop-history-title">History</h2>
      </div>
      <div className="coop-history-content">
        {historyloading ? (
          <p>Loading...</p>
        ) : history?.length > 0 ? (
          Object.keys(groupedDeliveries).map((month) => (
            <Section key={month} title={month} data={groupedDeliveries[month]} />
          ))
        ) : (
          <div className="coop-history-no-history">
            <p>No history available.</p>
          </div>
        )}
        {historyerror && <p className="coop-history-error">Error fetching history: {historyerror}</p>}
      </div>
    </div>
  );
};

export default CoopHistory;