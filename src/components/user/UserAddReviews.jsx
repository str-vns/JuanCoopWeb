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
    }
  }, [isReview]);

  const handlePostReview = () => {
    if (stars === 0) {
      setErrorMessage("Please rate the product");
      return;
    }
    const comment = {
      user: userId,
      order: transactionId,
      productId,
      rating: stars,
      comment: review,
    };

    dispatch(createComment(comment, token));
    navigate("/");
    setReview("");
    setStars(0);
    setErrorMessage("");
  };

  const handleBack = () => {
    navigate("/orders");
  };

  return (
    <div className="container-rev">
      <Navbar />
      <img src={yeyImage} alt="Product" className="productImage-rev" />

      <h2 className="question-rev">
        Please Leave Review for {products?.productName}
      </h2>
      <p className="subText-rev">
        By providing reviews we can improve your next order. Thank you!
      </p>

      <StarRatings
        rating={stars}
        starRatedColor="gold"
        changeRating={setStars}
        numberOfStars={5}
        name="rating"
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
