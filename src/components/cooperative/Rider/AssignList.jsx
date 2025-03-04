import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deliveryList } from "@redux/Actions/deliveryActions";
import { shippedOrder } from "@redux/Actions/orderActions";
import { CircularProgress, Typography, AppBar, Toolbar, Button, Card, CardContent } from "@mui/material";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";
import { Navigate, useNavigate } from "react-router-dom";

const AssignList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const token = getToken();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Assign");

  const { shiploading, orders, shiperror } = useSelector(state => state.orderShipped);
  const { deliveries } = useSelector(state => state.deliveryList);

  const checkIfDelivered = (orderItems) => {
    const today = new Date();
    return deliveries.some((delivery) =>
      orderItems.some((orderItem) => {
        const deliveryDate = new Date(delivery.createdAt);
        return (
          delivery._id === orderItem.deliveryId &&
          deliveryDate.toDateString() === today.toDateString() &&
          ["delivering", "re-delivery", "pending", "delivered"].includes(delivery.status)
        );
      })
    );
  };

  useEffect(() => {
    if (token) {
      dispatch(shippedOrder(userId, token));
      dispatch(deliveryList(userId, token));
      setLoading(false);
    }
  }, [dispatch, userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(shippedOrder(userId, token));
    dispatch(deliveryList(userId, token));
    setRefreshing(false);
  }, [userId, token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipping":
        return "blue";
      default:
        return "black";
    }
  };

  const capitalizeFirstLetter = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <div style={{ padding: "20px" }}>
      <Sidebar />
      <header style={{ backgroundColor: "#FCF300", color: "black", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>Assigned Orders</h1>
        <button 
          style={{ backgroundColor: "#FFD700", color: "black", fontWeight: "bold", padding: "8px 15px", border: "none", cursor: "pointer" }}
          onClick={() => navigate("/coophistory")}
        >
          History
        </button>
      </header>



       {/* Tab Navigation */}
       <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "15px", 
          padding: "15px", 
          backgroundColor: "#F8F9FA", // Light background for better contrast
          borderRadius: "10px", 
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: activeTab === "Assign" ? "#FFD500" : "white",
              color: activeTab === "Assign" ? "black" : "#333",
              fontWeight: "bold",
              padding: "10px 20px",
              border: activeTab === "Assign" ? "none" : "2px solid #FFD500",
              "&:hover": {
                backgroundColor: activeTab === "Assign" ? "#FFC300" : "#FFD500",
                color: "black"
              }
            }}
            onClick={() => setActiveTab("Assign")}
          >
            Assign
          </Button>
          
          <Button 
            variant="contained"
            sx={{
              backgroundColor: activeTab === "Rider" ? "#FFD500" : "white",
              color: activeTab === "Rider" ? "black" : "#333",
              fontWeight: "bold",
              padding: "10px 20px",
              border: activeTab === "Rider" ? "none" : "2px solid #FFD500",
              "&:hover": {
                backgroundColor: activeTab === "Rider" ? "#FFC300" : "#FFD500",
                color: "black"
              }
            }}
            onClick={() => {
              setActiveTab("Rider");
              navigate("/riderlist");
            }}
          >
            Rider
          </Button>
        </div>


      {loading || shiploading ? (
        <CircularProgress />
      ) : shiperror || orders?.length === 0 ? (
        <Typography variant="h6" color="error" align="center">No Assigned Orders.</Typography>
      ) : (
        <div>
          {orders.map((order) => {
            const isDelivered = checkIfDelivered(order?.orderItems);
            return (
              <Card key={order._id} style={{ marginBottom: "10px" }}>
                <CardContent>
                  <Typography variant="h6">
                    {order.user.firstName} {order.user.lastName}
                  </Typography>
                  <Typography variant="body2">Order # {order._id}</Typography>
                  <Typography variant="body2">
                    Status:{" "}
                    <span style={{ color: getStatusColor(order?.orderItems[0]?.orderStatus) }}>
                      {capitalizeFirstLetter(order?.orderItems[0]?.orderStatus)}
                    </span>
                  </Typography>

                  {!isDelivered && (
                    <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#FFD500",
                      color: "black",
                      fontWeight: "bold",
                      "&:hover": { backgroundColor: "#FFC300" }, // Slightly darker shade on hover
                    }}
                    onClick={() => navigate(`/assignrider/${order._id}`, { state: { order } })}
                  >
                    Assign Now
                  </Button>
                  
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignList;