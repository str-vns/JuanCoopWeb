import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { categoryEdit } from "@redux/Actions/categoryActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import Sidebar from "../sidebar";

const CategoryUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const singleCategory = location.state?.category; // Ensure category data is passed

  const currentUser = getCurrentUser();
  const storedToken = getToken();
  const userId = currentUser?._id;
  
  // Fix: Initialize with empty string instead of undefined
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [errors, setErrors] = useState("");
  const categoryId = singleCategory?._id || null;

  useEffect(() => {
    if (singleCategory) {
      setCategoryName(singleCategory.categoryName || ""); // Fix: Set categoryName correctly
      setExistingImage(singleCategory.image?.url || ""); // Fix: Ensure image URL is set
    }
  }, [singleCategory]);

  const handleCategoryUpdate = async () => {
    setErrors("");

    if (!categoryName.trim()) {
      setErrors("Category name is required!");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);

    if (image) {
      formData.append("image", image);
    } else {
      formData.append("existingImage", existingImage);
    }

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
        setErrors("Please upload a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors("Image size must be less than 5MB.");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors("");
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <h1 style={styles.title}>Update Category</h1>
      <div style={styles.form}>
        <input
          type="text"
          style={styles.input}
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <input type="file" style={styles.input} onChange={handleImageChange} accept="image/*" />

        {existingImage && !imagePreview && (
          <div>
            <p>Current Image:</p>
            <img src={existingImage} alt="Category" style={styles.image} />
          </div>
        )}

        {imagePreview && (
          <div>
            <p>New Image:</p>
            <img src={imagePreview} alt="New Category" style={styles.image} />
          </div>
        )}

        {errors && <p style={styles.errorText}>{errors}</p>}

        <button style={styles.button} onClick={handleCategoryUpdate}>Update Category</button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "20px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" },
  image: { width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" },
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
  errorText: { color: "red", fontSize: "14px" },
};

export default CategoryUpdate;
