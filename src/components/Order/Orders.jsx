import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrders, updateOrderStatus } from "@redux/Actions/orderActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/orderlist.css";
import Navbar from "../layout/navbar";
const Orders = () => {
  const dispatch = useDispatch();
  const { loading, orders } = useSelector((state) => state.orders);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [refresh, setRefresh] = useState(false);

  // Get current user and user ID
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  // Handle the filtered orders
  const filteredOrders = orders
    ?.map((order) => ({
      ...order,
      orderItems: order.orderItems.filter((item) => item.orderStatus !== "Cancelled"),
    }))
    .filter((order) => order.orderItems.length > 0);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));  // Fetch orders using the userId
    } else {
      console.error("User not found or not authenticated");
    }
  }, [dispatch, userId]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      if (userId) {
        dispatch(fetchUserOrders(userId));  // Refetch orders when refreshed
      }
      setRefresh(false);
    }, 500);
  }, [dispatch, userId]);

  const handleCancelOrder = (orderId, inventoryId) => {
    setRefresh(true);
    const status = {
      orderStatus: "Cancelled",
      inventoryProduct: inventoryId,
    };
    try {
      dispatch(updateOrderStatus(orderId, status));
      onRefresh();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setRefresh(false);
    }
  };

  const toggleExpandedOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  return (
    <div className="order-container">
       <Navbar />
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        filteredOrders.map((order) => {
          const isExpanded = expandedOrders[order._id];
          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order ID: {order._id}</span>
                <span className="order-total">
                  Total: ₱{order.totalPrice.toFixed(2)}
                </span>
              </div>
              {order.orderItems.slice(0, 1).map((item) => (
                <div key={item._id} className="order-item">
                  <img
                    src={item.product.image[0]?.url || "/placeholder-image.png"}
                    alt={item.product.productName}
                    className="product-image"
                  />
                  <div className="product-details">
                    <span className="product-name">{item.product.productName}</span>
                    <span className="product-size">
                      Size: {item.inventoryProduct.unitName} {item.inventoryProduct.metricUnit}
                    </span>
                    <span className="product-quantity">Qty: {item.quantity}</span>
                    <span className="product-price">₱{item.inventoryProduct.price}</span>
                  </div>
                  <span className={`order-status ${item.orderStatus.toLowerCase()}`}>
                    {item.orderStatus}
                  </span>
                  {item.orderStatus === "Pending" && (
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelOrder(order._id, item.inventoryProduct._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              ))}
              {isExpanded &&
                order.orderItems.slice(1).map((item) => (
                  <div key={item._id} className="order-item">
                    <img
                      src={item.product.image[0]?.url || "/placeholder-image.png"}
                      alt={item.product.productName}
                      className="product-image"
                    />
                    <div className="product-details">
                      <span className="product-name">{item.product.productName}</span>
                      <span className="product-size">
                        Size: {item.inventoryProduct.unitName} {item.inventoryProduct.metricUnit}
                      </span>
                      <span className="product-quantity">Qty: {item.quantity}</span>
                      <span className="product-price">₱{item.inventoryProduct.price}</span>
                    </div>
                    <span className={`order-status ${item.orderStatus.toLowerCase()}`}>
                      {item.orderStatus}
                    </span>
                    {item.orderStatus === "Pending" && (
                      <button
                        className="cancel-button"
                        onClick={() =>
                          handleCancelOrder(order._id, item.inventoryProduct._id)
                        }
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                ))}
              {order.orderItems.length > 1 && (
                <button
                  className="expand-button"
                  onClick={() => toggleExpandedOrder(order._id)}
                >
                  {isExpanded ? "Show Less" : "Show All"}
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div className="no-orders">No orders found.</div>
      )}
    </div>
  );
};

export default Orders;
