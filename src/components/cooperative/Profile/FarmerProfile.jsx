import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCoopProducts } from "@redux/Actions/productActions";
import axios from "axios";
import baseURL from "@Commons/BaseUrl";
import "@assets/css/productcard.css";
import Navbar from "../../layout/navbar";
import { createConversation } from "@redux/Actions/converstationActions";
import { conversationList } from "@redux/Actions/converstationActions";
import { getUsers } from "@redux/Actions/userActions";
import { useSocket } from "../../../../SocketIo";
import { getToken, getCurrentUser } from "@utils/helpers";

const FarmerProfile = () => {
  const { coopId } = useParams();
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();
  const [coopDetails, setCoopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const token = getToken();
  const userProfile = getCurrentUser();
  const userId = userProfile?._id || null;

  // Redux state
  const products = useSelector((state) => state?.CoopProduct?.coopProducts || []);
  const { conversations } = useSelector((state) => state.converList);

  // Find an existing conversation between the user and the cooperative
  const existConvo = conversations?.find(
    (convo) =>
      convo.members.includes(coopDetails?.user?._id) &&
      convo.members.includes(userId)
  );

  useEffect(() => {
    if (userId && token) {
      dispatch(conversationList(userId, token));
    }
  }, [userId, token, dispatch]);

  useEffect(() => {
    const fetchCoopDetails = async () => {
      try {
        setLoading(true);

        if (!coopId) throw new Error("Cooperative ID is missing");

        const { data } = await axios.get(`${baseURL}farm/${coopId}`);

        if (!data.details) throw new Error("Cooperative details not found");

        setCoopDetails(data.details);

        const coopUserId = data.details?.user?._id;

        if (coopUserId) {
          dispatch(getCoopProducts(coopUserId));
        } else {
          throw new Error("Invalid User ID");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch cooperative details");
      } finally {
        setLoading(false);
      }
    };

    fetchCoopDetails();
  }, [coopId, dispatch]);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("addUser", userId);
      socket.on("getUsers", (users) => {
        setOnlineUsers(users.filter((user) => user.online && user.userId !== null));
      });
      return () => socket.off("getUsers");
    }
  }, [socket, userId]);

  useEffect(() => {
    if (coopDetails?.user?._id && onlineUsers.length > 0) {
      setIsOnline(onlineUsers.some((user) => user.userId === coopDetails.user._id));
    } else {
      setIsOnline(false);
    }
  }, [coopDetails, onlineUsers]);

  const chatNow = async () => {
    const cooperativeUserId = coopDetails?.user?._id;
    
    if (!userId || !token) {
      navigate("/login");
      return;
    }
  
    console.log("Checking for existing conversation...");
    console.log("Existing conversations:", conversations);
    console.log("Cooperative User ID:", cooperativeUserId);
    console.log("Current User ID:", userId);
  
    if (existConvo && existConvo._id) {
      console.log("Navigating to existing conversation:", existConvo._id);
      navigate(`/chat/${existConvo._id}`, { replace: true });
    } else {
      try {
        console.log("Creating a new conversation...");
        const newConvo = { senderId: userId, receiverId: cooperativeUserId };
        
        const response = await dispatch(createConversation(newConvo, token));
        console.log("Response from createConversation:", response);
  
        const newConvoId = response?.payload?._id;
        if (newConvoId) {
          console.log("Navigating to new conversation:", newConvoId);
          setTimeout(() => {
            navigate(`/chat/${newConvoId}`, { replace: true });
          }, 500);
        } else {
          console.error("Failed to create conversation: No conversation ID returned");
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="farmer-profile-container">
      <Navbar />
      {coopDetails && (
        <div className="coop-header">
          <div className="coop-image-container">
            <img
              src={coopDetails?.user?.image?.url || "/default-profile.jpg"}
              alt="Cooperative"
              className="coop-image"
            />
          </div>
          <div className="coop-info">
            <h2>
              <strong>Name:</strong> {coopDetails.farmName}
            </h2>
            <p>
              <strong>Location:</strong> {coopDetails.barangay}, {coopDetails.city}
            </p>
            <button onClick={chatNow} className="chat-now-button">
              Chat Now <i className="fa-regular fa-message" style={{ marginLeft: "8px" }}></i>
            </button>
          </div>
        </div>
      )}

      <div className="product-list">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product?._id || Math.random()} className="product-card">
              <img
                src={product?.image?.[0]?.url || "/placeholder.png"}
                alt={product?.productName || "Product"}
                className="product-image"
              />
              <h4>{product?.productName || "Unnamed Product"}</h4>
              <p>₱ {product?.stock?.[0]?.price || "N/A"}</p>
              <a href={`/product/${product?._id}`} className="view-product-btn">
                View Product
              </a>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;
