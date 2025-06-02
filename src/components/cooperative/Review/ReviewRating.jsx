import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Sidebar from "../sidebar";
import "@assets/css/coopreviewrating.css";

const ReviewRating = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const product = state?.product || {};
  const reviews = product?.reviews || [];

  const calculateAverage = (key) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review[key] || 0), 0);
    return total / reviews.length;
  };

  const toPercentage = (rating) => Math.round((rating / 5) * 100);

  const overallProductRating = calculateAverage("rating");
  const overallServiceRating = calculateAverage("serviceRating");
  const overallDeliveryRating = calculateAverage("driverRating");

  const productPercentage = toPercentage(overallProductRating);
  const servicePercentage = toPercentage(overallServiceRating);
  const deliveryPercentage = toPercentage(overallDeliveryRating);

  const getMessage = (percentage, category) => {
    if (percentage >= 90)
      return `${category}: Excellent! (${percentage}%) Keep up the great work!`;
    if (percentage >= 75)
      return `${category}: Very Good! (${percentage}%) Customers are happy.`;
    if (percentage >= 50)
      return `${category}: Average (${percentage}%) Consider some improvements.`;
    if (percentage >= 30)
      return `${category}: Below Average (${percentage}%) Needs improvement.`;
    return `${category}: Poor (${percentage}%) Immediate improvements needed!`;
  };

  const getSentiment = (rating) => {
    if (rating >= 4) return "😊 Positive";
    if (rating >= 2.5) return "😐 Neutral";
    return "😡 Negative";
  };

  const handleReplyClick = (review) => {
    navigate(`/replyreview/${review._id}`, {
      state: {
        review,
        productId,
        productName: product.productName,
      },
    });
  };

  return (
    <div className="review-container">
      <Sidebar />
      <div className="review-header">
        <h1>Review Summary</h1>
      </div>

      <div className="review-card">
        <h2>{product.productName} - Overall Rating</h2>

        <div className="overall-ratings">
          <div className="rating-category">
            <h3>Product Rating</h3>
            <div className="star-container">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`star ${i < overallProductRating ? "star-yellow" : "star-gray"}`}
                />
              ))}
            </div>
            <p>{getMessage(productPercentage, "Product Rating")}</p>
          </div>

          <div className="rating-category">
            <h3>Seller Service</h3>
            <div className="star-container">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`star ${i < overallServiceRating ? "star-yellow" : "star-gray"}`}
                />
              ))}
            </div>
            <p>{getMessage(servicePercentage, "Seller Service Rating")}</p>
          </div>

          <div className="rating-category">
            <h3>Delivery Speed</h3>
            <div className="star-container">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`star ${i < overallDeliveryRating ? "star-yellow" : "star-gray"}`}
                />
              ))}
            </div>
            <p>{getMessage(deliveryPercentage, "Delivery Speed Rating")}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-box">
              <h2 className="review-title">Product Reviews</h2>
              <img src={review.user?.image?.url || "default-user.png"} alt="Profile" />
              <h3>
                {review.user?.firstName || "Anonymous"} {review.user?.lastName || ""}
              </h3>

              <label>Product Quality</label>
              <div className="star-container">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`star ${i < (review.rating || 0) ? "star-yellow" : "star-gray"}`}
                  />
                ))}
              </div>

              <label>Seller Service</label>
              <div className="star-container">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`star ${i < (review.serviceRating ?? 0) ? "star-yellow" : "star-gray"}`}
                  />
                ))}
              </div>

              <label>Delivery Speed</label>
              <div className="star-container">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`star ${i < (review.driverRating ?? 0) ? "star-yellow" : "star-gray"}`}
                  />
                ))}
              </div>

              <p>Sentiment: {getSentiment(review.rating)}</p>
              <p>Comment: {review.comment || "No review available."}</p>

              {/* Reply Review Button */}
              <button
                onClick={() => handleReplyClick(review)}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "yellow",
                  color: "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Reply Review
              </button>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewRating;