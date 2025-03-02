import React from "react";
import { FaTimes } from "react-icons/fa"; // Import close icon from react-icons/fa
import "@assets/css/bloginfo.css";

const BlogInfo = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null; // If modal is not open, don't render

  // Function to open links in the default browser
  const handleLinkPress = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      console.error("No URL provided");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{post.title}</h3>
          
        </div>

        {/* Modal Content */}
        <div className="modal-content-container" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <p className="modal-date">
            Published on: {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="modal-content">{post.content}</p>

          {/* External Website Link */}
          {post.link && (
            <button
              onClick={() => handleLinkPress(post.link)}
              className="link-button-blog"
            >
              Visit External Website
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="close-btn">
          <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogInfo;