import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Error from "../../shared/Error";
import StarRatings from "react-star-ratings";
import { FaArrowLeft } from "react-icons/fa";
import { createComment } from "@redux/Actions/commentActions";
import { getSingleProduct } from "@redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import "@assets/css/userAddReviews.css";
import yeyImage from "@assets/img/yey.png";
import Navbar from "../layout/navbar";

const UserAddReview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const productId = queryParams.get("productId");

  const user = getCurrentUser();
  const token = getToken();
  const userId = user?._id;
  const { products } = useSelector((state) => state.allProducts);
  const transactionId = orderId;

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(0);
  const [sellerService, setSellerService] = useState(0);
  const [errormessage, setErrorMessage] = useState("");

  const isReview = products?.reviews?.find(
    (prod) =>
      prod.user?.toString() === userId?.toString() &&
      prod.order?.toString() === transactionId?.toString()
  );

  useEffect(() => {
    dispatch(getSingleProduct(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (isReview) {
      setReview(isReview.comment);
      setStars(isReview.rating);
      setDeliverySpeed(isReview.deliverySpeed || 0);
      setSellerService(isReview.sellerService || 0);
    }
  }, [isReview]);

  const handlePostReview = () => {
    if (stars === 0 || deliverySpeed === 0 || sellerService === 0) {
      setErrorMessage("Please rate all categories");
      return;
    }
    const comment = {
      user: userId,
      order: transactionId,
      productId,
      rating: stars,         // Product Quality Rating
      driverRating: deliverySpeed,  // Delivery Speed Rating
      serviceRating: sellerService, // Seller Service Rating
      comment: review,
    };

    dispatch(createComment(comment, token));
    navigate("/");
    setReview("");
    setStars(0);
    setDeliverySpeed(0);
    setSellerService(0);
    setErrorMessage("");
  };

  return (
    <div className="container-rev">
      <Navbar />
      {/* <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button> */}
      <img src={yeyImage} alt="Product" className="productImage-rev" />

      <h2 className="question-rev">
        Please Leave Review for {products?.productName}
      </h2>
      <p className="subText-rev">
        By providing reviews we can improve your next order. Thank you!
      </p>

      <label>Product Rating</label>
      <StarRatings
        rating={stars}
        starRatedColor="gold"
        changeRating={setStars}
        numberOfStars={5}
        name="rating"
      />

      <label>Delivery Speed</label>
      <StarRatings
  rating={deliverySpeed}
  starRatedColor="gold"
  changeRating={(newRating) => setDeliverySpeed(newRating)}
  numberOfStars={5}
  name="deliverySpeed"
/>
<label>Seller Service</label>
<StarRatings
  rating={sellerService}
  starRatedColor="gold"
  changeRating={(newRating) => setSellerService(newRating)}
  numberOfStars={5}
  name="sellerService"
/>


      
      <textarea
        className="textInput-rev"
        placeholder="Tell us about your experience"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      {errormessage && <Error message={errormessage} />}

      <button className="button-rev" onClick={handlePostReview}>
        Post
      </button>
    </div>
  );
};

export default UserAddReview;
