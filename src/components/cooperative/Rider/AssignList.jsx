import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deliveryList } from "@redux/Actions/deliveryActions";
import { shippedOrder } from "@redux/Actions/orderActions";
import {
  CircularProgress,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";
import { Navigate, useNavigate } from "react-router-dom";
import "@assets/css/assignlist.css"


const AssignList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const token = getToken();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Assign");

  const { shiploading, orders, shiperror } = useSelector(
    (state) => state.orderShipped
  );
  const { deliveries } = useSelector((state) => state.deliveryList);

  const checkIfDelivered = (orderItems) => {
    const today = new Date();
    return deliveries.some((delivery) =>
      orderItems.some((orderItem) => {
        const deliveryDate = new Date(delivery.createdAt);
        return (
          delivery._id === orderItem.deliveryId &&
          deliveryDate.toDateString() === today.toDateString() &&
          ["delivering", "re-delivery", "pending", "delivered"].includes(
            delivery.status
          )
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

  const capitalizeFirstLetter = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    
    <div className="assigned-Order">
      <Sidebar />
    <div className="assign-list-header">
      <h1>Assigned Orders</h1>
      <button className="btn-add-rider" onClick={() => navigate("/coophistory")}>
      <i class="fa-solid fa-file"></i>
      </button>
    </div>

    <div className="tab-navigation-container">
      <Button
        variant="contained"
        className={`tab-button ${activeTab === "Assign" ? "active" : ""}`}
        onClick={() => setActiveTab("/assignlist")}
      >
        Assign
      </Button>
      <Button
        variant="contained"
        className={`tab-button ${activeTab === "Rider" ? "active" : ""}`}
        onClick={() => navigate("/riderlist")}
      >
        Rider
      </Button>
    </div>

    {loading || shiploading ? (
      <CircularProgress />
    ) : shiperror || orders?.length === 0 ? (
      <Typography variant="h6" color="error" align="center">
        No Assigned Orders.
      </Typography>
    ) : (
      <div>
        {orders.map((order) => {
          const isDelivered = checkIfDelivered(order?.orderItems);
          return (
            <div className="tab-card-container"> 
            <Card key={order._id} style={{ marginBottom: "10px" }}>
              <CardContent>
                <Typography variant="h6">
                  {order.user.firstName} {order.user.lastName}
                </Typography>
                <Typography variant="body2">Order # {order._id}</Typography>
                <Typography variant="body2">
                  Status: {" "}
                  <span
                    style={{
                      color: getStatusColor(order?.orderItems[0]?.orderStatus),
                    }}
                  >
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
                      "&:hover": { backgroundColor: "#FFC300" },
                    }}
                    onClick={() =>
                      navigate(`/assignrider/${order._id}`, {
                        state: { order },
                      })
                    }
                  >
                    Assign Now
                  </Button>
                )}
              </CardContent>
            </Card>
            </div>
          );
        })}
      </div>
    )}
  </div>
  );
};

export default AssignList;
