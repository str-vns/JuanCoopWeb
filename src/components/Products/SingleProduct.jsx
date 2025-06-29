import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "@assets/css/productcard.css";
import Navbar from "../layout/navbar";
import { addToCart } from "@redux/Actions/cartActions";
import { getCoop } from "@redux/Actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import baseURL from "@Commons/baseUrl";
import { WishlistUser } from "@redux/Actions/userActions";
import { Profileuser } from "@redux/Actions/userActions";
import { isAuth, getToken, getCurrentUser } from "@utils/helpers";

const Stars = ({ count }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < count ? "★" : "☆"));
  return <span className="stars">{stars.join("")}</span>;
};

const ProductCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();
  const auth = isAuth();
  const userId = getCurrentUser();
  const [product, setProduct] = useState(null);
  const [coopDetails, setCoopDetails] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingCoop, setLoadingCoop] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistMessage, setWishlistMessage] = useState(""); // State for wishlist message
  const { coop } = useSelector((state) => state.singleCoop);
  const { user, error } = useSelector((state) => state.userOnly);

  console.log("wishlist:", wishlist);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoadingProduct(true);
        const { data } = await axios.get(`${baseURL}products/${id}`);
        const productDetails = data?.details;
        setProduct(productDetails);
        if (productDetails.stock?.length > 0) {
          setSelectedStock(productDetails.stock[0]);
        }

        setLoadingProduct(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoadingProduct(false);
      }
    };

    fetchProductDetails();

    if (product?.coop) {
      dispatch(getCoop(product.coop));
    }
  
    if (userId?._id && token) {
      dispatch(Profileuser(userId._id, token));
    }
  
  }, [id]);

  // Fetch Cooperative Details
  useEffect(() => {
    if (product?.coop) {
      const fetchCoopDetails = async () => {
        try {
          setLoadingCoop(true);
          const { data } = await axios.get(`${baseURL}farm/${product.coop}`);
          setCoopDetails(data?.details);
          setLoadingCoop(false);
        } catch (error) {
          console.error("Error fetching cooperative details:", error);
          setLoadingCoop(false);
        }
      };

      fetchCoopDetails();
    }
  }, [product?.coop]);

  // Fetch Coop Details using Redux
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (token && auth && user && Array.isArray(user?.wishlist)) {
        const matchingProducts = user?.wishlist.filter(
          (item) => item?.product === product?._id
        );
        setWishlist(matchingProducts);
      }
    };
  
    checkLoginStatus();
  
  }, [user]);

  const handleAddToCart = () => {
    if (!selectedStock) return;

    const cartItem = {
      inventoryId: selectedStock._id,
      productId: product._id,
      productName: product.productName,
      pricing: selectedStock.price,
      quantity,
      metricUnit: selectedStock.metricUnit,
      unitName: selectedStock.unitName,
      coop: product.coop,
      image: product.image[0]?.url,
      maxQuantity: selectedStock.quantity,
    };

    dispatch(addToCart(cartItem));
    console.log("Cart Item:", cartItem);
    setCartMessage("Added to cart!");
  };

  const handleImageChange = (direction) => {
    if (product.image?.length > 1) {
      setCurrentImageIndex((prevIndex) => {
        return direction === "next"
          ? (prevIndex + 1) % product.image.length
          : (prevIndex - 1 + product.image.length) % product.image.length;
      });
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) =>
      type === "add"
        ? Math.min(prevQuantity + 1, selectedStock?.quantity)
        : Math.max(prevQuantity - 1, 1)
    );
  };

  const handleStockSelect = (item) => {
    setSelectedStock(item);
    setQuantity(1);
  };

  const handleFavorite = async () => {
    if (!auth) {
      console.log("Navigating to login");
      navigate("/login");
      return;
    }
  
    try {
      if (token) {
        await dispatch(WishlistUser(product?._id, userId?._id, token)); 
        await dispatch(Profileuser(userId?._id, token)); 

        // Check if the product is already in the wishlist
        const isInWishlist = wishlist.some((item) => item?.product === product?._id);

        if (!isInWishlist) {
          setWishlistMessage("Added to wishlist!"); // Show message only when added
          setTimeout(() => setWishlistMessage(""), 3000); // Clear message after 3 seconds
        }
      } else {
        console.log("No JWT token found.");
      }
    } catch (error) {
      console.error("Error retrieving JWT:", error);
    }
  };
  

  if (loadingProduct) return <div>Loading Product...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Navbar />
      <div className="product-card-container">
        <div className="product-carousel">
          <div className="image-container">
            <img
              src={
                product.image[currentImageIndex]?.url || product.image[0]?.url
              }
              alt={`Product ${currentImageIndex + 1}`}
              className="product-carousel-img"
            />
            <button
              className="carousel-button prev-button"
              onClick={() => handleImageChange("prev")}
            >
              &#9664;
            </button>
            <button
              className="carousel-button next-button"
              onClick={() => handleImageChange("next")}
            >
              &#9654;
            </button>
          </div>
        </div>

        <div className="product-details">
          <h2 className="product-title">
            {product.productName}
            <div style={{ display: "inline-flex", alignItems: "center", marginLeft: "10px" }}>
              <button
                className="wishlist-icon"
                onClick={handleFavorite}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                <FaHeart color={wishlist.length > 0 ? "#ff6961" : "#ccc"} size={20} />
              </button>
              {wishlistMessage && (
                <span className="wishlist-message" style={{ marginLeft: "8px" }}>
                  {wishlistMessage}
                </span>
              )}
            </div>
          </h2>
          <div className="price-section">
            <span className="current-price">
              {selectedStock?.price ? `₱ ${selectedStock.price}` : "N/A"}
            </span>
          </div>

          <div className="reviews">
            <Stars count={product?.ratings} />
            <span className="review-count">
              ({product.reviews.length} Customer Reviews)
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-attributes">
            Stock: {selectedStock?.quantity ? selectedStock.quantity : "0"}
          </div>

          <div className="stock-label">Product Size:</div>
          <div className="stock-info">
            {product.stock && product.stock.length > 0 ? (
              product.stock
                .filter((item) => item.quantity > 0)
                .map((item, index) => (
                  <button
                    key={index}
                    className={`stock-box stock-label ${
                      selectedStock === item ? "selected" : ""
                    }`}
                    onClick={() => handleStockSelect(item)}
                  >
                    {item.unitName} {item.metricUnit}
                  </button>
                ))
            ) : (
              <span className="stock-label">No Stock Available</span>
            )}
          </div>

          <div className="add-to-cart">
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange("subtract")}
              >
                -
              </button>
              <input
                type="text"
                className="quantity-input"
                value={quantity}
                readOnly
              />
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange("add")}
              >
                +
              </button>
            </div>
            <button
              className={`add-button ${
                selectedStock?.quantity > 0 ? "btn-active" : "btn-disabled"
              }`}
              onClick={handleAddToCart}
              disabled={selectedStock?.quantity <= 0}
            >
              Add to Cart
            </button>
            {cartMessage && <p className="cart-message">{cartMessage}</p>}
          </div>
        </div>
      </div>

      <div className="cooperative-details">
        {loadingCoop ? (
          <p>Loading Cooperative Details...</p>
        ) : coopDetails ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="coop-image-container">
                <img
                  src={coopDetails?.user?.image?.url || "/default-profile.jpg"}
                  alt="Cooperative"
                  className="coop-image"
                  style={{ marginRight: "15px", borderRadius: "50%", width: "60px", height: "60px" }}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <p
                  style={{
                    fontSize: "0.9em",
                    margin: "2px 0",
                    color: "#666",
                  }}
                >
                  <strong>Farm Name:</strong> {coopDetails.farmName}
                </p>
                <p
                  style={{
                    fontSize: "0.9em",
                    margin: "2px 0",
                    color: "#666",
                  }}
                >
                  <strong>Location:</strong> {coopDetails.barangay}, {coopDetails.city}
                </p>
              </div>
            </div>
            <a
              href={`/farmerprofile/${product.coop}`}
              className="view-shop-btn"
            >
              View Shop
            </a>
          </div>
        ) : (
          <p>Cooperative details not available.</p>
        )}
      </div>


      <div className="comment-reviews-container">
  <h3>Reviews</h3>
  {product.reviews.length > 0 ? (
    product.reviews.map((review, index) => (
      <div className="review" key={index}>
        <div className="review-header-user">
          <div className="reviewer-info">
            <img
              src={
                review.user?.image?.url
                  ? review.user.image.url
                  : "/default-profile.jpg"
              }
              alt={`${review.user?.firstName || "Anonymous"} profile`}
              className="reviewer-profile-picture"
            />
            <h4>
              {review.user?.firstName || "Anonymous"}{" "}
              {review.user?.lastName || ""}
            </h4>
          </div>
          <Stars count={review.rating} />
        </div>

        <p>{review.comment}</p>

        {/* Display replies if any */}
        {review.replyComment && review.replyComment.length > 0 && (
  <div
    className="review-replies"
    style={{
      marginTop: "1rem",
      background: "#f6f8fa",
      borderRadius: "10px",
      padding: "14px 14px 6px 14px",
      border: "1px solid #ececec",
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    }}
  >
    <h5 style={{ marginBottom: "12px", fontWeight: 600, color: "#7c5c2c", textAlign: "center" }}>
      Replies from Cooperative:
    </h5>
    {Array.isArray(review.replyComment) &&
      review.replyComment.map((reply, i) => (
        <div
          key={i}
          className="review-reply"
          style={{
            marginBottom: "18px",
            padding: "10px 0 10px 0",
            borderBottom: i !== review.replyComment.length - 1 ? "1px solid #eee" : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {coopDetails?.user?.image?.url ? (
              <img
                src={coopDetails.user.image.url}
                alt="Cooperative"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #c8a876",
                  background: "#fff",
                  marginBottom: "4px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  color: "#a88a4c",
                  border: "2px solid #c8a876",
                  marginBottom: "4px",
                }}
              >
                <i className="fas fa-store"></i>
              </div>
            )}
            <div style={{ fontWeight: 600, fontSize: "15px", color: "#a88a4c", marginBottom: "2px", textAlign: "center" }}>
              {coopDetails?.farmName || "Farm Name"}
            </div>
          </div>
          <div style={{ color: "#333", fontSize: "14px", marginBottom: "2px", textAlign: "center" }}>
            {reply.commenting}
          </div>
          <div style={{ fontSize: "12px", color: "#aaa", textAlign: "center" }}>
            {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ""}
          </div>
        </div>
      ))}
  </div>
)}
      </div>
    ))
  ) : (
    <p>No reviews yet.</p>
  )}
</div>

    </>
  );
};

export default ProductCard;
