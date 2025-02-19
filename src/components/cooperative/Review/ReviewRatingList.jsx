import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCoopProducts } from "@src/redux/Actions/productActions";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getToken } from "@utils/helpers";
import Sidebar from "../sidebar";
import "@assets/css/reviewratinglist.css";

const ReviewRatingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const Coopid = currentUser?._id;
  const { loading, coopProducts } = useSelector((state) => state.CoopProduct);
  const token = getToken();

  useEffect(() => {
    dispatch(getCoopProducts(Coopid));
  }, [dispatch, Coopid, token]);

  return (
    <div className="review-rating-list container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <div className="review-rating-list__header">
        <h1>Product Review List</h1>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="review-rating-list__loading">Loading...</div>
      ) : (
        <div className="review-rating-list__grid">
          {coopProducts?.map((item) => (
            <div key={item._id} className="review-rating-list__card">
              <img
                src={item?.image[0]?.url || "https://via.placeholder.com/150"}
                alt={item.productName}
                className="review-rating-list__image"
              />
              <h2 className="review-rating-list__title">{item.productName}</h2>
              <p className="review-rating-list__description">{item.description}</p>
              <p className="review-rating-list__sentiment">
                Sentiment: <span>{item.sentiment || "Neutral"}</span>
              </p>
              <button
                onClick={() => navigate(`/reviews/${item._id}`, { state: { product: item } })}
                className="review-rating-list__button"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewRatingList;