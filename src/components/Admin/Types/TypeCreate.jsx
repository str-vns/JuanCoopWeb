import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { typeCreate } from "@redux/Actions/typeActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import Sidebar from "@components/Admin/sidebar";

const TypeCreate = () => {
  const [typeName, setTypeName] = useState("");
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
      alert("Type created successfully!");
      setTypeName("");
      navigate("/typelist"); // Redirect to TypeList page
    }
    if (error) {
      alert(error || "Failed to create type. Please try again.");
    }
  }, [success, error, navigate]);

  const handleCreateType = () => {
    if (!typeName.trim()) {
      alert("Validation Error: Type name is required!");
      return;
    }

    const typeData = {
      typeName, // Fixed key to match backend requirements
      user: context?.stateUser?.userProfile?._id,
    };

    if (!token) {
      alert("Error: User is not authenticated. Please log in.");
      return;
    }

    dispatch(typeCreate(typeData, token));
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <button onClick={() => navigate("/typelist")} style={styles.backButton}>
        <span style={{ fontSize: "24px" }}></span>
      </button>

      <h1 style={styles.title}>Create Type</h1>

      <input
        type="text"
        style={styles.input}
        placeholder="Type Name"
        value={typeName}
        onChange={(e) => setTypeName(e.target.value)}
      />

      <button
        style={styles.button}
        onClick={handleCreateType}
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

export default TypeCreate;
