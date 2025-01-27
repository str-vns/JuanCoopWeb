import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog } from "@redux/Actions/blogActions";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers"; 

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [token, setToken] = useState("");
  
  const currentUser = getCurrentUser(); // Get the current user using the helper function
  const storedToken = getToken(); // Get the token using the helper function
  const userId = currentUser?._id; // Extract user ID from the currentUser
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.createBlog || {}
  );

  useEffect(() => {
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("Token not found in localStorage.");
    }
  }, [storedToken]);

  useEffect(() => {
    if (success) {
      alert("Blog created successfully!");
      setTitle("");
      setContent("");
      setLink("");
      navigate("/bloglists");
    }
    if (error) {
      alert(error || "Failed to create blog. Please try again.");
    }
  }, [success, error, navigate]);

  const handleCreateBlog = () => {
    if (!userId) {
        alert("User is not defined. Please log in again.");
        return;
    }

    const blogData = {
        title,
        content,
        link,
        user: userId,
    };

    console.log("Creating blog with data:", blogData);

    dispatch(createBlog(blogData, token))
        .then(() => {
            alert("Blog created successfully!");
            setTitle("");
            setContent("");
            setLink("");
            navigate("/bloglists");
        })
        .catch((error) => {
            console.error("Error creating blog:", error);
            alert("Error creating blog. Please try again.");
        });
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <button onClick={() => navigate("/bloglists")} style={styles.backButton}>
        <span style={{ fontSize: "24px" }}>Back</span>
      </button>

      <h1 style={styles.title}>Create Blog</h1>

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

      <button
        style={styles.button}
        onClick={handleCreateBlog}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Blog"}
      </button>

      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "16px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    paddingLeft: "100px",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "16px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#007BFF",
  },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "16px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#FEC120",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  errorText: { color: "red", marginTop: "16px" },
};

export default BlogCreate;
