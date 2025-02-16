import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoryCreate } from "@redux/Actions/categoryActions";
import { getToken } from "@utils/helpers";
import Sidebar from "../sidebar";

const CategoryCreate = () => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.categoriesCreate || {}
  );

  useEffect(() => {
    const jwt = getToken();
    if (jwt) setToken(jwt);
  }, []);

  useEffect(() => {
    console.log("Success state:", success);
    console.log("Error state:", error);

    if (success) {
      alert("Category created successfully!");
      setCategoryName("");
      setImage(null);
      navigate("/categorylist"); // Redirect after success
    }
    if (error) {
      setErrorMessage(error); // Display error message if available
    }
  }, [success, error, navigate]); // Ensure `navigate` is in the dependency array

  const handleCategoryCreate = () => {
    console.log("Creating category with:", { categoryName, image, token });

    if (!categoryName.trim()) {
      setErrorMessage("Category name is required!");
      return;
    }

    if (!image) {
      setErrorMessage("Please upload an image for the category.");
      return;
    }

    const categoryData = { categoryName };

    if (!token) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }

    dispatch(categoryCreate(categoryData, image, token));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 5MB.");
        return;
      }
      setImage(file);
      setErrorMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <h1 style={styles.title}>Create Category</h1>

      <input
        type="text"
        style={styles.input}
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <input
        type="file"
        style={styles.input}
        onChange={handleImageChange}
        accept="image/*"
      />

      <button
        style={styles.button}
        onClick={handleCategoryCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Category"}
      </button>

      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
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

export default CategoryCreate;
