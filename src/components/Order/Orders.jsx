import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrders, updateOrderStatus } from "@redux/Actions/orderActions";
import { getCurrentUser } from "@utils/helpers";
import { useNavigate } from "react-router-dom";
import "@assets/css/orderlist.css";
import Navbar from "../layout/navbar";

const Orders = () => {
  const dispatch = useDispatch();
  const { loading, orders } = useSelector((state) => state.orders);
  const [expandedOrders, setExpandedOrders] = useState({});
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));
    }
  }, [dispatch, userId]);

  const onRefresh = useCallback(() => {
    setTimeout(() => {
      if (userId) {
        dispatch(fetchUserOrders(userId));
      }
    }, 500);
  }, [dispatch, userId]);

  const handleCancelOrder = (orderId, inventoryId) => {
    const status = {
      orderStatus: "Cancelled",
      inventoryProduct: inventoryId,
    };
    try {
      dispatch(updateOrderStatus(orderId, status));
      onRefresh();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const toggleExpandedOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const handleViewQR = (order) => {
    navigate("/qr", { state: { order } });
  };

  return (
    <div className="order-container">
      <Navbar />
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : orders && orders.length > 0 ? (
        orders.map((order) => {
          const isExpanded = expandedOrders[order._id];
          return (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order ID: {order._id}</span>
                <span className="order-total">Total: ₱{order.totalPrice.toFixed(2)}</span>
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

                  {/* Show QR button only for "Shipping" orders */}
                  {item.orderStatus === "Shipping" && (
                    <div className="qr-section">
                      <button className="qr-button" onClick={() => handleViewQR(order)}>
                        QR Code
                      </button>
                    </div>
                  )}

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

                    {/* Show QR button only for "Shipping" orders */}
                    {item.orderStatus === "Shipping" && (
                      <div className="qr-section">
                        <button className="qr-button" onClick={() => handleViewQR(order)}>
                          QR Code
                        </button>
                      </div>
                    )}

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
