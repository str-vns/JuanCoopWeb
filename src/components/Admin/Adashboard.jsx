import React, { useCallback, useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDailySales, getWeeklySales, getMonthlySales } from "@redux/Actions/salesActions";
import { useNavigate } from "react-router-dom";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getCurrentUser, getToken } from "@utils/helpers";
import { Profileuser } from "@redux/Actions/userActions";
import { useSocket } from "../../../SocketIo";
import Sidebar from "../layout/sidebar";
import styles from "../../assets/css/adminDashboard";

const Adashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(AuthGlobal);
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
      return <div style={{ color: "red" }}>Error: {sales.error}</div>;
    }

    if (sales.data && sales.data.details && Array.isArray(sales.data.details) && sales.data.details.length > 0) {
      const totalSales = sales.data.details.reduce((acc, sale) => acc + (sale.totalRevenue || 0), 0);
      return <div>Total Sales: {totalSales > 0 ? totalSales : "N/A"}</div>;
    }

    return <div>No sales data available</div>;
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Sales Dashboard</h1>
      </div>

      <div style={styles.salesContainer}>
        <div style={styles.salesCard}>
          <h2 style={styles.cardTitle}>Daily Sales</h2>
          {renderSales(dailySales)}
        </div>

        <div style={styles.salesCard}>
          <h2 style={styles.cardTitle}>Weekly Sales</h2>
          {renderSales(weeklySales)}
        </div>

        <div style={styles.salesCard}>
          <h2 style={styles.cardTitle}>Monthly Sales</h2>
          {renderSales(monthlySales)}
        </div>
      </div>

      <button style={styles.navigateButton} onClick={() => navigate("/barGraph")}>
        View Bar Graph
      </button>

      <button style={styles.refreshButton} onClick={onRefresh}>
        {refreshing ? "Refreshing..." : "Refresh Sales"}
      </button>

      {errors && <div style={{ color: "red", marginTop: "20px" }}>{errors}</div>} {/* Display errors */}
    </div>
  );
};

export default Adashboard;

