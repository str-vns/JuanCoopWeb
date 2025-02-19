import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FaStar, FaBars } from 'react-icons/fa';
import Sidebar from '../sidebar';

const ReviewRating = () => {
  const { state } = useLocation();
  const { productId } = useParams();
  const product = state?.product || {};

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 shadow-md rounded-lg">
        <button className="text-2xl"><FaBars /></button>
        <h1 className="text-xl font-bold">Product Review List</h1>
      </div>

      {/* Overall Rating */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold">{product.productName} - Overall Rating</h2>
        <div className="flex justify-center mt-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`text-${i < (product.ratings || 0) ? 'yellow' : 'gray'}-500`} />
          ))}
        </div>
      </div>

      {/* Suggestions Section */}
      {product.sentiment && (
        <div className="mt-6 p-4 bg-blue-100 text-blue-700 rounded-lg shadow-md">
          <p>
            {product.sentiment === "Mostly positive" && "Your product is doing great! Keep up the good work."}
            {product.sentiment === "positive" && "Keep up the good work! Your product is doing great."}
            {product.sentiment === "negative" && "Your product needs improvement, more marketing, and better services."}
            {product.sentiment === "Mostly negative" && "Your product needs a lot of improvement, more marketing, and better services."}
          </p>
        </div>
      )}

      {/* Reviews Section */}
      <h2 className="mt-6 text-lg font-semibold">Product Reviews</h2>
      <div className="mt-4">
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="flex items-start p-4 bg-white shadow-md rounded-lg mb-4">
              <img src={review.user?.image?.url || "default-user.png"} 
                   alt="Profile" 
                   className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h3 className="font-semibold">
                  {review.user?.firstName || "Anonymous"} {review.user?.lastName || ""}
                  <span className={`ml-2 text-sm ${review.sentimentScore <= -15 ? 'text-red-600' 
                    : review.sentimentScore < 0 ? 'text-red-500' 
                    : review.sentimentScore >= 15 ? 'text-green-600' 
                    : review.sentimentScore > 0 ? 'text-green-500' 
                    : 'text-gray-500'}`}>
                    {review.sentimentScore <= -15 ? 'Mostly Negative' 
                      : review.sentimentScore < 0 ? 'Negative' 
                      : review.sentimentScore >= 15 ? 'Mostly Positive' 
                      : review.sentimentScore > 0 ? 'Positive' 
                      : 'Neutral'}
                  </span>
                </h3>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-${i < review.rating ? 'yellow' : 'gray'}-500`} />
                  ))}
                </div>
                <p className="mt-2 text-gray-700">{review.comment || "No review available."}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewRating;