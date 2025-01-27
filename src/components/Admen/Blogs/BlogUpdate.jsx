import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateBlog } from "@redux/Actions/blogActions";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers"; // Import helper functions
import Sidebar from "../sidebar";

const BlogUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const singleBlog = location.state?.blog; // Extract blog data from location state
  
  const currentUser = getCurrentUser(); // Get the current user using the helper function
  const storedToken = getToken(); // Get the token using the helper function
  const userId = currentUser?._id; // Extract user ID from the currentUser
  const [title, setTitle] = useState(singleBlog?.title || "");
  const [content, setContent] = useState(singleBlog?.content || "");
  const [link, setLink] = useState(singleBlog?.link || "");
  const [errors, setErrors] = useState("");
  const blogId = singleBlog?._id || null;

  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Single blog object:", singleBlog);
    console.log("Extracted blogId:", blogId);
  }, [location, singleBlog, blogId]);

  const handleUpdateBlog = async () => {
    if (!title || !content || !link) {
      setErrors("Please fill in all fields");
      return;
    }

    const blogItem = { title, content, link };

    try {
      if (storedToken && blogId) {
        // Dispatch Redux action to update the blog
        await dispatch(updateBlog(blogId, blogItem, storedToken));
        setErrors(""); // Clear errors
        alert("Blog updated successfully!");
        navigate("/bloglists"); // Redirect after successful update
      } else {
        setErrors("Invalid token or blog ID.");
        console.error("Invalid token or blogId:", storedToken, blogId);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrors(error.response?.data?.message || "Failed to update the blog. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <h1 style={styles.title}>Update Blog</h1>
      <div style={styles.form}>
        {/* Title Input */}
        <input
          style={styles.input}
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content Input */}
        <textarea
          style={{ ...styles.input, ...styles.textArea }}
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Link Input */}
        <input
          style={styles.input}
          type="text"
          placeholder="Blog Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* Error Message */}
        {errors && <p style={styles.errorText}>{errors}</p>}

        {/* Update Button */}
        <button style={styles.button} onClick={handleUpdateBlog}>
          Update Blog
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  textArea: {
    height: "120px",
    resize: "none",
  },
  button: {
    backgroundColor: "#FEC120",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
  },
};

export default BlogUpdate;
