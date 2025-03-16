import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCoopOrders } from "@redux/Actions/coopActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { createConversation, conversationList } from "@redux/Actions/converstationActions";
import { getUsers } from "@redux/Actions/userActions";
import { useSocket } from "../../../../SocketIo";
import { getCurrentUser, getToken, isAuth } from "@utils/helpers";
import '@assets/css/updateorderstatus.css'

const UpdateOrderStatus = ({ isOpen, order, onClose, onUpdateStatus }) => {
  if (!isOpen) return null; 
  const dispatch = useDispatch();
  const socket = useSocket();
  const token = getToken();
  const userId = getCurrentUser()._id;
  const userName = getCurrentUser().firstName;
  const auth = isAuth();
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "");
  const { users } = useSelector((state) => state.getThemUser);
  const { conversations } = useSelector((state) => state.converList);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const navigate = useNavigate();

  console.log("Order Data:", order);

  useEffect(() => {
    if (userId && token) {
      dispatch(conversationList(userId, token));
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    if (conversations && Array.isArray(conversations) && userId && token) {
      const friends = conversations.flatMap((conversation) =>
        conversation.members.filter((member) => member !== userId)
      );

      if (friends.length > 0) {
        dispatch(getUsers(friends, token));
      }
    }
  }, [conversations, userId, token]);

  useEffect(() => {
    socket.emit("addUser", userId);

    socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(
        (user) => user.online && user.userId !== null
      );
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off("getUsers");
    };
  }, [socket, userId]);

  useEffect(() => {
    if (users && onlineUsers.length > 0) {
      const userIsOnline = users.some((user) =>
        onlineUsers.some(
          (onlineUser) =>
            onlineUser.userId === user.details._id &&
            onlineUser.online &&
            onlineUser.userId !== null
        )
      );

      setIsOnline(userIsOnline);
    } else {
      setIsOnline(false);
    }
  }, [users, onlineUsers]);

  const handlesProcess = async (orderId, InvId, order) => {
    console.log("id:", orderId, "items:", InvId, "order:", order);
    setLoading(true);
  
    try {
      let productName = [];
  
      order?.orderItems?.forEach((item) => {
        if (item.product && item.inventoryProduct) {
          const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
          productName.push(productInfo);
        }
      });
  
      const productList = productName.join(", ");
  
      const notification = {
        title: `Order: ${orderId}`,
        content: `Your order ${productList} is now being processed.`,
        url: order?.orderItems[0]?.product?.image[0].url,
        user: order?.user?._id,
        type: "order",
      };
  
      socket.emit("sendNotification", {
        senderName: userName,
        receiverName: order?.user?._id,
        type: "order",
      });
  
      const orderupdateInfo = {
        InvId,
        orderStatus: "Processing",
      };
  
      const response = await dispatch(updateCoopOrders(orderId, orderupdateInfo, token));
      await dispatch(sendNotifications(notification, token));
  
      console.log("response", response);
  
      if (response) {
        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    onClose();
  };
  
  const handlesShipping = async (orderId, InvId, order) => {
    console.log("id:", orderId, "items:", InvId, "order:", order);
    setLoading(true);
  
    try {
      let productName = [];
  
      order?.orderItems?.forEach((item) => {
        if (item.product && item.inventoryProduct) {
          const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit}`;
          productName.push(productInfo);
        }
      });
  
      const productList = productName.join(", ");
  
      const notification = {
        title: `Order: ${orderId}`,
        content: `Your order ${productList} is now being shipped.`,
        url: order?.orderItems[0]?.product?.image[0].url,
        user: order?.user?._id,
        type: "order",
      };
  
      socket.emit("sendNotification", {
        senderName: userName,
        receiverName: order?.user?._id,
        type: "order",
      });
  
      const orderupdateInfo = {
        InvId,
        orderStatus: "Shipping",
      };
  
      const response = await dispatch(updateCoopOrders(orderId, orderupdateInfo, token));
      await dispatch(sendNotifications(notification, token));
  
      console.log("response", response);
  
      if (response) {
        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    onClose();
  };

  const chatNow = async (order) => {
    setLoading(true);
    const UserIdThe = order?.user?._id;
    const currentUserId = userId;

    const existConvo = conversations.find(
      (convo) =>
        convo.members.includes(userId) && convo.members.includes(UserIdThe)
    );
    const conversationExists = Boolean(existConvo);

    if (auth) {
      try {
        if (conversationExists && existConvo) {
          navigate("/messenger", {
            state: {
              item: order?.user,
              conversations: conversations,
              isOnline: onlineUsers,
            },
          });
        } else {
          const newConvo = {
            senderId: currentUserId,
            receiverId: UserIdThe,
          };

          const response = await dispatch(createConversation(newConvo, token));
          if (response) {
            setTimeout(() => {
              navigate("/messenger", {
                state: {
                  item: order.user,
                  conversations: conversations,
                  isOnline: onlineUsers,
                },
              });
            }, 5000);
            setRefresh(false);
          } else {
            console.error("Error creating conversation");
            setRefresh(false);
          }
        }
      } catch (error) {
        console.error(
          "Error while creating or navigating to conversation:",
          error
        );
      }
    } else {
      navigate("/register", { state: { screen: "login" } });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500"; // Example Tailwind class
      case "Shipped":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };


  
  return (
    <div className="cooporder-status-modal-overlay">
      <div className="cooporder-status-modal-box">
        {/* Order ID and Date at the top center */}
        <div className="cooporder-status-header">
          <h2 className="cooporder-status-order-id">Order ID: {order?._id}</h2>
          <p className="cooporder-status-order-date">
            {new Date(order?.createdAt).toLocaleDateString()}
          </p>
        </div>
  
        {/* Left Side: Name, Email, Total, Payment Method, Payment Status */}
        <div className="cooporder-status-details">
          <div className="cooporder-status-left">
            <p><strong>Name:</strong> {order?.user?.firstName} {order?.user?.lastName}</p>
            <p><strong>Email:</strong> {order?.user?.email}</p>
            <p><strong>Total:</strong> ₱ {order?.totalPrice}</p>
            <p><strong>Payment Method:</strong> {order?.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {order?.payStatus}</p>
          </div>
  
          {/* Right Side: Delivery Address */}
          <div className="cooporder-status-right">
            <p><strong>Delivery Address:</strong></p>
            <p>{order?.shippingAddress?.address}, {order?.shippingAddress?.city}</p>
          </div>
        </div>
  
        {/* Product Details */}
        <h3 className="cooporder-status-products-title">Products:</h3>
        <ul className="cooporder-status-products-list">
          {order?.orderItems?.map((product, index) => (
            <li key={index} className="cooporder-status-product-item">
              {/* Product Image */}
              <div className="cooporder-status-product-image">
                {product?.product?.image && product?.product?.image?.length > 0 ? (
                  <img
                    src={product?.product?.image[0]?.url}
                    alt="Product"
                    onError={() => console.error("Error loading image")}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
  
              {/* Product Name, Price, and Quantity */}
              <div className="cooporder-status-product-info">
                <p><strong>Name:</strong> {product?.product?.productName || "Unknown Product"}</p>
                <p><strong>Price:</strong> ₱ {product?.price || 0}</p>
                <p><strong>Quantity:</strong> {product?.quantity || 0}</p>
              </div>
  
              {/* Status and View Button */}
              <div className="cooporder-status-product-status">
                <p className={`cooporder-status-status ${getStatusClass(product?.orderStatus)}`}>
                  <span>Status: </span>
                  {product?.orderStatus}
                </p>
                {product?.orderStatus === "Cancelled" && (
                  <button
                    className="cooporder-status-view-button"
                    onClick={() => navigate("/reasoncancelled", { state: { order: product } })}
                  >
                    View
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
  
        {/* Buttons Section */}
        <div className="cooporder-status-actions">
          {/* Chat Button */}
          <button
            className="cooporder-status-chat-button"
            disabled={loading}
            onClick={() => chatNow(order)}
          >
            Chat
          </button>
  
          {/* Close and Processing Buttons */}
          <div className="cooporder-status-bottom-buttons">
            <button className="cooporder-status-close-button" onClick={onClose}>
              Close
            </button>
            {order?.orderItems?.length > 0 &&
              order?.orderItems?.flat()?.some(orderItem => orderItem?.orderStatus === "Pending") && (
                loading ? (
                  <button className="cooporder-status-processing-button" disabled>
                    Processing...
                  </button>
                ) : (
                  <button
                    className="cooporder-status-processing-button"
                    onClick={() =>
                      handlesProcess(
                        order?._id,
                        order?.orderItems
                          .flat()
                          .filter(orderItem => orderItem?.orderStatus !== "Cancelled")
                          .map(orderItem => orderItem?.inventoryProduct._id),
                        order
                      )
                    }
                  >
                    Processing
                  </button>
                )
              )}
              {order?.orderItems?.length > 0 &&
                order?.orderItems?.flat()?.some(orderItem => orderItem?.orderStatus === "Processing") && (
                  loading ? (
                    <button className="cooporder-status-processing-button" disabled>
                      Shipping...
                    </button>
                  ) : (
                    <button
                      className="cooporder-status-processing-button"
                      onClick={() => 
                        handlesShipping(
                          order?._id,
                          order?.orderItems
                            .flat()
                            .filter(orderItem => orderItem?.orderStatus !== "Cancelled")
                            .map(orderItem => orderItem?.inventoryProduct._id),
                          order
                        )
                      }
                    >
                      Shipping
                    </button>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;