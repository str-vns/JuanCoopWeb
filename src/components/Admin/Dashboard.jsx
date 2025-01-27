import React, { useCallback, useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDailySales, getWeeklySales, getMonthlySales } from "@redux/Actions/salesActions";
import { useNavigate } from "react-router-dom";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getCurrentUser } from "@utils/helpers";
import { Profileuser } from "@redux/Actions/userActions";
import { useSocket } from "../../../SocketIo";
import Sidebar from "../../components/layout/sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(AuthGlobal);
  const socket = useSocket();
  const userId = getCurrentUser(); // Call getCurrentUser to get the actual userId
  console.log(userId);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { dailySales, weeklySales, monthlySales } = useSelector((state) => state.sales);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [token, setToken] = useState(null);

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
        const res = await AsyncStorage.getItem("jwt");
        if (res) {
          setToken(res);
          dispatch(Profileuser(userId, res));
        } else {
          setErrors("No JWT token found.");
        }
      } catch (error) {
        console.error("Error retrieving JWT:", error);
        setErrors("Failed to retrieve JWT token.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

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

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    maxWidth: "800px",
    padding: "20px",
    width: "calc(100% - 400px)",
    marginLeft: "300px",
    marginTop: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  menuButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    alignItems: "center",
  },
  salesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  salesCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  navigateButton: {
    backgroundColor: "#f7b900",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    marginBottom: "10px",
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
  },
};

export default Dashboard;
