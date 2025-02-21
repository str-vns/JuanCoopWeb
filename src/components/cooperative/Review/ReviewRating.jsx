import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Sidebar from '../sidebar';
import "@assets/css/coopreviewrating.css"; // Import the external CSS

const ReviewRating = () => {
  const { state } = useLocation();
  const { productId } = useParams();
  const product = state?.product || {};

  return (
    <div className="review-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <div className="review-header">
        <h1>Product Review List</h1>
      </div>

      {/* Overall Rating */}
      <div className="review-card">
        <h2>{product.productName} - Overall Rating</h2>
        <div className="star-container">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`star ${i < (product.ratings || 0) ? 'star-yellow' : 'star-gray'}`} 
            />
          ))}
        </div>
      </div>

      {/* Suggestions Section */}
      {product.sentiment && (
        <div className="suggestions">
          <p>
            {product.sentiment === "Mostly positive" && "Your product is doing great! Keep up the good work."}
            {product.sentiment === "positive" && "Keep up the good work! Your product is performing well."}
            {product.sentiment === "negative" && "Your product needs improvement, better marketing, and enhanced services."}
            {product.sentiment === "Mostly negative" && "Significant improvements are needed. Focus on better marketing and service quality."}
          </p>
        </div>
      )}

      {/* Reviews Section */}
      <h2 className="w-full max-w-3xl mt-6 text-xl font-semibold text-yellow-900 text-center">Product Reviews</h2>
      <div className="reviews-section">
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review-box">
              <img src={review.user?.image?.url || "default-user.png"} alt="Profile" />
              <h3>
                {review.user?.firstName || "Anonymous"} {review.user?.lastName || ""}
                <span className={`sentiment ${
                  review.sentimentScore <= -15 ? 'sentiment-mostly-negative' 
                    : review.sentimentScore < 0 ? 'sentiment-negative' 
                    : review.sentimentScore >= 15 ? 'sentiment-mostly-positive' 
                    : review.sentimentScore > 0 ? 'sentiment-positive' 
                    : ''
                }`}>
                  {review.sentimentScore <= -15 ? 'Mostly Negative' 
                    : review.sentimentScore < 0 ? 'Negative' 
                    : review.sentimentScore >= 15 ? 'Mostly Positive' 
                    : review.sentimentScore > 0 ? 'Positive' 
                    : 'Neutral'}
                </span>
              </h3>
              <div className="star-container">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`star ${i < review.rating ? 'star-yellow' : 'star-gray'}`} />
                ))}
              </div>
              <p className="mt-2 text-gray-700">{review.comment || "No review available."}</p>
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