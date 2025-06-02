import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { replyComment } from "@src/redux/Actions/commentActions";
import { getCurrentUser, getToken } from "@utils/helpers";
import Sidebar from "../sidebar";

const ReplyReview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = getCurrentUser();
  const token = getToken();

  const { review, productId, productName } = state || {};

  const [reply, setReply] = useState(review?.reply || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (review?.reply) {
      setReply(review.reply);
    }
  }, [review]);

  const handleReply = async () => {
    if (!reply.trim()) {
      setErrorMessage("Reply cannot be empty.");
      return;
    }

    if (reply.length > 500) {
      setErrorMessage("Reply must be less than 500 characters.");
      return;
    }

    try {
      const response = await dispatch(
        replyComment(
          {
            user: user?._id,
            comment: reply,
            reviewId: review?._id,
          },
          token
        )
      );

      if (response) {
        setReply("");
        setErrorMessage("");
        navigate(-1);
      }
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="reply-review-container" style={{ display: "flex", minHeight: "100vh", background: "white" }}>
      <Sidebar />

      <div
        className="reply-review-content"
        style={{
          flex: 1,
          maxWidth: 500,
          margin: "40px auto",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(255,193,7,0.13)",
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          className="reply-review-title"
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#c8a876",
            marginBottom: "22px",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          Reply to Review for <span style={{ color: "#7c5c2c" }}>{productName}</span>
        </h1>

        <div
          className="reply-review-details"
          style={{
            background: "#fffde7",
            borderRadius: "12px",
            padding: "18px 18px 12px 18px",
            marginBottom: "24px",
            width: "100%",
            boxShadow: "0 2px 8px rgba(255,193,7,0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <img
              src={review.user?.image?.url || "default-user.png"}
              alt="Profile"
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                border: "3px solid #ffd600",
                background: "#fffbe7",
                objectFit: "cover",
                marginRight: "14px",
                boxShadow: "0 2px 8px rgba(255,193,7,0.13)",
              }}
            />
            <span style={{ fontWeight: 600, color: "#7c5c2c", fontSize: "1.1rem" }}>
              {review?.user?.firstName} {review?.user?.lastName}
            </span>
          </div>
          <p style={{ color: "#444", fontSize: "1rem", textAlign: "center" }}>
            <strong style={{ color: "#c8a876" }}> Comment:</strong> {review?.comment || "No comment"}
          </p>
        </div>

        <div className="reply-review-form-group" style={{ width: "100%", marginBottom: "18px" }}>
          <label
            htmlFor="replyText"
            className="reply-review-label"
            style={{ fontWeight: 600, color: "#7c5c2c", marginBottom: "6px", display: "block" }}
          >
            Your Reply
          </label>
          <textarea
            id="replyText"
            className="reply-review-textarea"
            placeholder="Write your reply here..."
            value={reply}
            maxLength={500}
            onChange={(e) => setReply(e.target.value)}
            style={{
              width: "100%",
              minHeight: "90px",
              borderRadius: "8px",
              border: "1.5px solid #ffe082",
              padding: "10px",
              fontSize: "1rem",
              background: "#fffbe7",
              color: "#7c5c2c",
              outline: "none",
              resize: "vertical",
              marginBottom: "4px",
            }}
          />
        </div>

        {errorMessage && (
          <div
            className="reply-review-error"
            style={{
              color: "#d32f2f",
              background: "#fff3e0",
              borderRadius: "6px",
              padding: "8px 12px",
              marginBottom: "12px",
              width: "100%",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </div>
        )}

        <button
          className="reply-review-submit"
          onClick={handleReply}
          style={{
            background: "linear-gradient(90deg, #ffd600 0%, #c8a876 100%)",
            color: "#7c5c2c",
            fontWeight: 700,
            fontSize: "1.1rem",
            border: "none",
            borderRadius: "8px",
            padding: "10px 32px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(255,193,7,0.13)",
            transition: "background 0.2s",
          }}
        >
          Submit Reply
        </button>
      </div>
    </div>
  );
};

export default ReplyReview;
