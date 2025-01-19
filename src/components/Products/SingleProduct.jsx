import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../assets/css/productcard.css";
import Navbar from "../layout/navbar";
import { addToCart } from "@redux/Actions/cartActions";
import { useDispatch } from "react-redux";

const Stars = ({ count }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < count ? "★" : "☆"));
  return <span className="stars">{stars.join("")}</span>;
};

const ProductCard = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedStock, setSelectedStock] = useState(product?.stock[0]);
  const [quantity, setQuantity] = useState(1); 
  console.log(localStorage.getItem("cartItems"));
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;

        // Fetch product details including coop ID
        const productResponse = await axios.get(`${baseURL}products/${id}`);
        const productDetails = productResponse.data.details;

        console.log("Product Details:", productDetails); 
        setProduct(productDetails);

        // // Fetch inventory data
        // const inventoryResponse = await axios.get(`${baseURL}inventory`);
        // const inventoryData = inventoryResponse.data.details.find(
        //   (item) => item.productId === id
        // );

        // const mergedData = {
        //   ...productDetails,
        //   price: inventoryData?.price || "N/A",
        //   stock: inventoryData?.quantity || 0,
        //   metricUnit: inventoryData?.metricUnit || "N/A",
        // };

        // setProduct(mergedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product or coop details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);


  const handleAddToCart = () => {

       const cartItem = {
        inventoryId: selectedStock._id,
        productId: product._id,
        productName: product.productName,
        pricing: selectedStock.price,
        quantity: quantity,
        metricUnit: selectedStock.metricUnit,
        unitName: selectedStock.unitName,
        coop: product.coop,
        image: product.image[0].url,
        maxQuantity: selectedStock.quantity,
       }
      //  localStorage.setItem("cartItems", JSON.stringify(cartItem));
       dispatch(addToCart(cartItem));
  console.log("Cart Item:", cartItem);
    
    // // Retrieve cart from local storage or initialize as empty array
    // let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // // Check if the product already exists in the cart
    // const existingProduct = cart.find((item) => item.id === id);
  
    // if (existingProduct) {
    //   // If the product exists, increase the quantity by 1
    //   existingProduct.quantity += 1;
    // } else {
    //   // Otherwise, add the new product with quantity 1
    //   cart.push({ id, name, price, image, quantity: 1 });
    // }
  
    // // Save the updated cart back to local storage
    // localStorage.setItem("cart", JSON.stringify(cart));
  };
  

  const handleImageChange = (direction) => {
    if (product.image?.length > 1) {
      setCurrentImageIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % product.image.length;
        } else {
          return (prevIndex - 1 + product.image.length) % product.image.length;
        }
      });
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) => {
      if (type === "add") {
        return Math.min(prevQuantity + 1, selectedStock?.quantity);
      }
      if (type === "subtract") {
        return Math.max(prevQuantity - 1, 1);
      }
      return prevQuantity;
    });
  };

  const handleStockSelect = (item) => {
    setSelectedStock(item); 
    setQuantity(1); 
  };
  
  useEffect(() => {
    if (product && product.stock.length > 0) {
      setSelectedStock(product.stock[0]);
    }
  }, [product]);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }


  return (
    <>
      <div className="product-card-container">
        <Navbar />
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
          <h2 className="product-title">{product.productName}</h2>
          <div className="price-section">
            {/* {product.stock.length > 0 ? () : ()} */}
            <span className="current-price">
              {selectedStock?.price ? `₱ ${selectedStock?.price}` : "N/A"}

            </span>
          </div>
       
          <div className="reviews">
            <Stars count={product?.ratings} />
            <span className="review-count">
              ({product.reviews.length} Customer Reviews)
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-attributes">Stock: 
          {selectedStock?.quantity ? ` ${selectedStock?.quantity}` : "N/A"} </div>
              
          <div className="stock-Label">Product Size:</div>
          <div className="stock-info">
  {product.stock && product.stock.length > 0 ? (
    product.stock.map((item, index) => (
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

          {/* Add to Cart Section */}
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
      <hr className="partition-line" />

      {/* Reviews Section */}
      <div className="comment-reviews-container">
        <h3>Reviews</h3>
        {product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            console.log(review.user.image.url),
            <div className="review" key={index}>
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src={
                      review.user?.image?.url
                        ? review.user?.image?.url
                        : "/default-profile.jpg"
                    }
                    alt={`${review.user?.firstName || "Anonymous"} profile`}
                    className="reviewer-profile-picture"
                  />
                  <h4>{review.user?.firstName || "Anonymous"} {review.user?.lastName || "Anonymous"}</h4> 
                </div>
                <Stars count={review.rating} />
              </div>
              <p>{review.comment}</p>
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
