import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deliveryList } from "@redux/Actions/deliveryActions";
import { shippedOrder } from "@redux/Actions/orderActions";
import { CircularProgress, Typography, AppBar, Toolbar, Button } from "@mui/material";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";

const AssignList = () => {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const token = getToken();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const { shiploading, orders, shiperror } = useSelector(state => state.orderShipped);
  const { deliveries } = useSelector(state => state.deliveryList);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          setLoading(true);
          dispatch(shippedOrder(token));
          dispatch(deliveryList(token));
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [dispatch, token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      dispatch(shippedOrder(token));
      dispatch(deliveryList(token));
    } catch (err) {
      console.error("Error refreshing orders:", err);
    } finally {
      setRefreshing(false);
    }
  }, [token]);

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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Assigned Orders</Typography>
          <Button onClick={onRefresh} color="inherit">Refresh</Button>
        </Toolbar>
      </AppBar>

      {loading || shiploading ? (
        <CircularProgress />
      ) : shiperror || orders?.length === 0 ? (
        <Typography variant="h6" color="error" align="center">No Assigned Orders.</Typography>
      ) : (
        <div>
          {orders.map((order) => {
            const isDelivered = checkIfDelivered(order?.orderItems);
            return (
              <div key={order._id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                <Typography variant="body1">Order ID: {order._id}</Typography>
                <Typography variant="body2">
                  Status: <span style={{ color: getStatusColor(order.status) }}>
                    {capitalizeFirstLetter(order.status)}
                  </span>
                </Typography>
                {!isDelivered && (
                  <Button variant="contained" color="primary">
                    Assign Now
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignList;