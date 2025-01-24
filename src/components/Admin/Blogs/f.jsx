import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createBlog } from "@redux/Actions/blogActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { useNavigate } from "react-router-dom";
import { getToken, getCurrentUser } from "@utils/helpers";

import Sidebar from "@components/Admin/sidebar";

const BlogCreate = () => {
    const context = useContext(AuthGlobal); // Initialize context at the top
  
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [link, setLink] = useState("");
    const [token, setToken] = useState("");
  
    // Get current user from context or helper function
    const currentUser = context?.stateUser?.userProfile || getCurrentUser();
    const userId = currentUser?._id;
    const storedToken = getToken(); 
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { loading, error, success } = useSelector(
      (state) => state.createBlog || {}
    );
  
    useEffect(() => {
      // Fetch the token from localStorage for web
      const fetchToken = () => {
        try {
          const jwt = localStorage.getItem("jwt");
          if (jwt) setToken(jwt);
        } catch (err) {
          console.error("Error fetching token:", err);
        }
      };
      fetchToken();
    }, []);
  
    useEffect(() => {
      if (success) {
        alert("Blog created successfully!");
        setTitle("");
        setContent("");
        setLink("");
        navigate("/bloglist");
      }
      if (error) {
        alert(error || "Failed to create blog. Please try again.");
      }
    }, [success, error, navigate]);
  
    const handleCreateBlog = () => {
      if (!title || !content || !link) {
        alert("All fields are required!");
        return;
      }
  
      const blogData = {
        title,
        content,
        link,
        user: userId, // Ensure userId is valid
      };
  
      console.log("Form Data:", blogData);
      console.log("Token being passed:", token);
  
      if (!token) {
        alert("Error: User is not authenticated. Please log in.");
        return;
      }
  
      dispatch(createBlog(blogData, token))
        .then(() => {
          console.log("Blog creation successful");
        })
        .catch((err) => {
          console.error("Error creating blog:", err);
        });
    };
  
    return (
      <div style={styles.container}>
        <Sidebar />
        <button style={styles.backButton} onClick={() => navigate("/blogs")}>
          &#8592; Back
        </button>
        <h1 style={styles.title}>Create New Blog</h1>
        <div style={styles.formContainer}>
          <input
            style={styles.input}
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            style={{ ...styles.input, ...styles.textArea }}
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            style={styles.input}
            type="url"
            placeholder="Link (e.g., https://example.com)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button style={styles.button} onClick={handleCreateBlog} disabled={loading}>
            {loading ? "Creating..." : "Create Blog"}
          </button>
          {error && <p style={styles.errorText}>Error: {error}</p>}
        </div>
      </div>
    );
  };
  
  

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#007BFF",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    width: "100%",
  },
  textArea: {
    height: "100px",
    resize: "none",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#FEC120",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginTop: "10px",
    textAlign: "center",
  },
};

export default BlogCreate;
