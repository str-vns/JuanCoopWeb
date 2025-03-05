import React, { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getWishlist, WishlistUser } from "@redux/Actions/userActions";
import Navbar from "../layout/navbar";
import { isAuth, getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const defaultImageUrl = "@assets/img/eggplant.png";
  const currentUser = getCurrentUser();
  const storedToken = getToken();
  const userId = currentUser && currentUser._id ? currentUser._id : null;
  const { user } = useSelector((state) => state.register);
  const wishlist = useMemo(() => user?.wishlist?.map((item) => item.product) || [], [user]);
  const [token, setToken] = useState(storedToken || "");
  const [refresh, setRefresh] = useState(false);
  const [wishlists, setWishlists] = useState(wishlist);

  // Fetch JWT token on mount
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = localStorage.getItem("jwt");
        if (res) {
          setToken(res);
        }
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  // Fetch wishlist when userId or token changes
  useEffect(() => {
    if (userId && token) {
      dispatch(getWishlist(userId, token));
    }
  }, [userId, token, dispatch]);

  // Update wishlists state only if wishlist changes
  useEffect(() => {
    if (wishlist.length > 0) {
      setWishlists(wishlist);
    }
  }, [wishlist]);

  // Refresh wishlist
  const onRefresh = useCallback(async () => {
    setRefresh(true);
    setTimeout(() => {
      dispatch(getWishlist(userId, token));
      setRefresh(false);
    }, 500);
  }, [userId, token, dispatch]);

  // Toggle wishlist heart
  const wishlistHeart = useCallback(async (productId) => {
    setRefresh(true);
    try {
      const res = localStorage.getItem("jwt");
      if (res) {
        setToken(res);
        await dispatch(WishlistUser(productId, userId, res));
        onRefresh();
      } else {
        console.log("No JWT token found.");
      }
    } catch (error) {
      console.error("Error retrieving JWT:", error);
    } finally {
      setRefresh(false);
    }
  }, [userId, token, dispatch, onRefresh]);

  // Handle product click
  const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Render wishlist item
  const renderItem = useCallback((item) => {
    if (!item) return null;
    return (
      <div className="product-card" key={item._id} onClick={() => handleProductClick(item._id)}>
        {item?.image?.[0]?.url ? (
          <img src={item.image[0].url} alt={item.productName} className="product-image" />
        ) : (
          <img src={defaultImageUrl} alt="Default Product" className="product-image" />
        )}
        <div className="product-info">
          <h3 className="product-name">{item?.productName || "Unnamed Product"}</h3>
          <p className="product-description">{item?.description || "No description available."}</p>
        </div>
        <div className="action-buttons">
          <button onClick={(e) => {
            e.stopPropagation();
            wishlistHeart(item._id);
          }} className="icon-button">
            <FaHeart size={24} color="#ff6961" />
          </button>
        </div>
      </div>
    );
  }, [handleProductClick, wishlistHeart, defaultImageUrl]);

  return (
    <div className="wishlist-container">
      <Navbar />
      {/* Wishlist Header */}
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>Your favorite items are saved here.</p>
      </div>
      {/* Wishlist Items */}
      {wishlists.length > 0 ? (
        <div className="wishlist-grid">
          {wishlists.map((item) => renderItem(item))}
        </div>
      ) : (
        <p>No items in wishlist</p>
      )}
    </div>
  );
};

export default Wishlist;