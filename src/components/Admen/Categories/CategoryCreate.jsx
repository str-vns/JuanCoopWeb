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
 const storedToken = getToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  const { loading, error, success } = useSelector(
    (state) => state.categoryCreate || {}
  );
  console.log("categoryCreate state:", { loading, error, success });
 
  useEffect(() => {
    const jwt = getToken();
    if (jwt) setToken(jwt);
  }, []);


 useEffect(() => {
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error("Token not found in localStorage.");
    }
  }, [storedToken]);

  useEffect(() => {
    if (success) {
      alert("Category created successfully!");
      setCategoryName("");
      setImage(null);
      navigate("/categorylist");
    }
    if (error) {
      alert(error || "Failed to create category. Please try again.");
    }
  }, [success, error, navigate]);

  const handleCategoryUpdate = async () => {
    setErrors("");
  
    if (!categoryName.trim()) {
      setErrors("Category name is required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("categoryName", categoryName);
  
    if (image) formData.append("image", image);
  
    try {
      if (storedToken && categoryId) {
        await dispatch(categoryEdit(categoryId, formData, storedToken));
        alert("Category updated successfully!");
        navigate("/categorylist");
      } else {
        setErrors("Invalid token or category ID.");
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "Failed to update category.");
    }
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
      <button onClick={() => navigate("/categorylist")} style={styles.backButton}>
        
      </button>

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