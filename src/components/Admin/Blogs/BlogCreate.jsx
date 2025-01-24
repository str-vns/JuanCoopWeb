import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createBlog } from "@redux/Actions/blogActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import Sidebar from "@components/Admin/sidebar";

const BlogCreate = () => {
    const [title, setTitle] = useState("");
     const [content, setContent] = useState("");
     const [link, setLink] = useState("");
     const [token, setToken] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const context = useContext(AuthGlobal);

  // Accessing state from Redux store
  const { loading, error, success } = useSelector(
    (state) => state.typesCreate || {}
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
    // Handle success or error after the dispatch
    if (success) {
      alert("Blog created successfully!");
      setTitle("");
      setContent("");
      setLink("");
      navigate("/bloglists"); // Redirect to TypeList page
    }
    if (error) {
      alert(error || "Failed to create type. Please try again.");
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
      user: context?.stateUser?.userProfile?._id,
    };

    if (!token) {
      alert("Error: User is not authenticated. Please log in.");
      return;
    }

    dispatch(createBlog(blogData, token));
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <button onClick={() => navigate("/bloglists")} style={styles.backButton}>
        <span style={{ fontSize: "24px" }}></span>
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
        {loading ? "Creating..." : "Create Type"}
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
