import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDailySales, getWeeklySales, getMonthlySales } from "@redux/Actions/salesActions";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getToken } from "@utils/helpers";
import { Profileuser } from "@redux/Actions/userActions";
import { useSocket } from "../../../../SocketIo";
import Sidebar from "../sidebar";
import "@assets/css/adminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const userId = getCurrentUser(); 
  const token = getToken();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { dailySales, weeklySales, monthlySales } = useSelector((state) => state.sales);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is not initialized.");
      return;
    }

    if (userId) {
      socket.emit("addUser", userId);
    } else {
      console.warn("User ID is missing.");
    }

    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter((user) => user.online && user.userId !== null);
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        dispatch(Profileuser(userId, token));
      } catch (error) {
        console.error("Error retrieving JWT:", error);
        setErrors("Failed to retrieve JWT token.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch, token]);

  useEffect(() => {
    dispatch(getDailySales());
    dispatch(getWeeklySales());
    dispatch(getMonthlySales());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getDailySales());
      await dispatch(getWeeklySales());
      await dispatch(getMonthlySales());
    } catch (err) {
      console.error("Error refreshing sales:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const renderSales = (sales) => {
    if (sales.loading) {
      return <div>Loading...</div>;
    }

    if (sales.error) {
      return <div className="error">Error: {sales.error}</div>;
    }

    if (sales.data && sales.data.details && Array.isArray(sales.data.details) && sales.data.details.length > 0) {
      const totalSales = sales.data.details.reduce((acc, sale) => acc + (sale.totalRevenue || 0), 0);
      return <div>Total Sales: {totalSales > 0 ? totalSales : "N/A"}</div>;
    }

    return <div>No sales data available</div>;
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="header">
        <h1 className="header-title">Sales Dashboard</h1>
      </div>

      <div className="sales-container">
        <div className="sales-card">
          <h2 className="card-title">Daily Sales</h2>
          {renderSales(dailySales)}
        </div>

        <div className="sales-card">
          <h2 className="card-title">Weekly Sales</h2>
          {renderSales(weeklySales)}
        </div>

        <div className="sales-card">
          <h2 className="card-title">Monthly Sales</h2>
          {renderSales(monthlySales)}
        </div>
      </div>

      <button className="navigate-button" onClick={() => navigate("/barGraph")}>
        View Bar Graph
      </button>

      <button className="refresh-button" onClick={onRefresh}>
        {refreshing ? "Refreshing..." : "Refresh Sales"}
      </button>

      {errors && <div className="error">{errors}</div>}
    </div>
  );
};

export default AdminDashboard;
