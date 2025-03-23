import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserOrders,
  updateOrderStatus,
} from "@redux/Actions/orderActions";
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

  const handleCancelOrder = (order, item) => {
    console.log("🔹 Cancelling order:", order);
    console.log("🔹 Item details:", item);
    console.log("🔹 Inventory Product ID:", item.inventoryProduct?._id);
    console.log("🔹 Order Item ID:", item._id || item.orderItemId);
  
    if (!item.inventoryProduct?._id) {
      console.error("❌ Missing inventory ID for order:", order);
      alert("Error: Inventory Product ID is missing!");
      return;
    }
  
    try {
      // Navigate to cancellation page with order and item details
      navigate("/client_cancelled", {
        state: {
          order,
          item,
          inventoryId: item.inventoryProduct._id, // Explicitly pass inventoryId
          orderItemId: item._id || item.orderItemId, // Explicitly pass Order Item ID
          coopUser: item.coopUser,
        },
      });
  
      console.log("✅ Item details before navigation:", item);
      console.log("✅ Order Item ID being passed:", item._id || item.orderItemId);
      console.log("✅ Inventory ID being passed:", item.inventoryProduct._id);
    } catch (error) {
      console.error("❌ Error navigating to cancellation page:", error);
    }
  };
  const toggleExpandedOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  // const handleViewQR = (order) => {
  //   navigate("/qr", { state: { order } });
  // };

 
  // const handleViewQR = (order) => {
  //   console.log("Order being passed to QR Page:", order); // Debugging output
  //   const deliveryId = order.orderItems[0]?.deliveryId || "MISSING_DELIVERY_ID"; // Get deliveryId from the first order item
  //   console.log("Delivery ID:", deliveryId); // Debugging output
  //   console.log("User ID:", currentUser?._id); // Debugging output
  
  //   navigate("/qr", {
  //     state: {
  //       order, // Pass the entire order object
  //       trackId: deliveryId, // Pass deliveryId
  //       userId: currentUser?._id || "UNKNOWN_USER", // Pass userId from currentUser
  //     },
  //   });
  // };
  const handleViewQR = (order) => {
    const deliveryId = order?.orderItems?.[0]?.deliveryId;

    if (!deliveryId) {
      console.error("❌ Missing deliveryId in order:", order);
      alert("Error: Delivery ID is missing for this order!");
      return;
    }

    console.log("✅ Extracted Delivery ID:", deliveryId); // Debugging

    navigate("/qr", {
      state: {
        order,
        trackId: deliveryId,
        userId: currentUser?._id || "UNKNOWN_USER",
      },
    });
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
                    <span className="product-name">
                      {item.product.productName}
                    </span>
                    {item.inventoryProduct ? (
                      <span className="product-size">
                        Size: {item.inventoryProduct.unitName}{" "}
                        {item.inventoryProduct.metricUnit}
                      </span>
                    ) : (
                      <span className="product-size">Size: N/A</span>
                    )}
                    <span className="product-quantity">
                      Qty: {item.quantity}
                    </span>
                    <span className="product-price">
                      ₱
                      {item.inventoryProduct
                        ? item.inventoryProduct.price
                        : "N/A"}
                    </span>
                  </div>
  
                  <span
                    className={`order-status ${item.orderStatus.toLowerCase()}`}
                  >
                    {item.orderStatus}
                  </span>
  
                  {/* Show QR button only for "Shipping" orders */}
                  {item.orderStatus === "Shipping" && (
                    <div className="qr-section">
                      <button
                        className="qr-button"
                        onClick={() => handleViewQR(order)}
                      >
                        QR Code
                      </button>
                    </div>
                  )}
  
                  {item.orderStatus === "Pending" && (
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelOrder(order, item)}

                    >
                      Cancel Order
                    </button>
                  )}
  
                  {/* Show Review button for "Delivered" orders */}
                  {item.orderStatus === "Delivered" && (
                    <button
                      className="review-button"
                      onClick={() => {
                        // Redirect to the review page with product details
                        window.location.href = `/review?productId=${item.product._id}&orderId=${order._id}`;
                      }}
                    >
                      Review
                    </button>
                  )}
                </div>
              ))}
  
              {isExpanded &&
                order.orderItems.slice(1).map((item) => (
                  <div key={item._id} className="order-item">
                    <img
                      src={
                        item.product.image[0]?.url || "/placeholder-image.png"
                      }
                      alt={item.product.productName}
                      className="product-image"
                    />
                    <div className="product-details">
                      <span className="product-name">
                        {item.product.productName}
                      </span>
                      <span className="product-size">
                        Size: {item.inventoryProduct.unitName}{" "}
                        {item.inventoryProduct.metricUnit}
                      </span>
                      <span className="product-quantity">
                        Qty: {item.quantity}
                      </span>
                      <span className="product-price">
                        ₱{item.inventoryProduct.price}
                      </span>
                    </div>
  
                    <span
                      className={`order-status ${item.orderStatus.toLowerCase()}`}
                    >
                      {item.orderStatus}
                    </span>
  
                    {/* Show QR button only for "Shipping" orders */}
                    {item.orderStatus === "Shipping" && (
                      <div className="qr-section">
                        <button
                          className="qr-button"
                          onClick={() => handleViewQR(order)}
                        >
                          QR Code
                        </button>
                      </div>
                    )}
  
                    {item.orderStatus === "Pending" && (
                      <button
                        className="cancel-button"
                        onClick={() =>
                          handleCancelOrder(
                            order._id,
                            item.inventoryProduct._id
                          )
                        }
                      >
                        Cancel Order
                      </button>
                    )}
  
                    {/* Show Review button for "Delivered" orders */}
                    {item.orderStatus === "Delivered" && (
                      <button
                        className="review-button"
                        onClick={() => {
                          // Redirect to the review page with product details
                          window.location.href = `/review?productId=${item.product._id}&orderId=${order._id}`;
                        }}
                      >
                        Review
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
