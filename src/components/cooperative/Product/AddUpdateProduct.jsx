import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../../assets/css/addupdateproduct.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryList } from "../../../redux/Actions/categoryActions";
import { typeList } from "../../../redux/Actions/typeActions";
import { createCoopProducts } from "../../../redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";

const AddUpdateProduct = ({ show, onClose, onSubmit, product, action }) => {
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(product ? product.stock : "");
  const [unit, setUnit] = useState(product ? product.unit : "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [price, setPrice] = useState(product ? product.price : "");
  const [maxPurchase, setMaxPurchase] = useState("");
  const [image, setImage] = useState([]); // Store image file objects
  const [imagePreview, setImagePreview] = useState([]); // Store image preview URIs

  const { categories } = useSelector((state) => state.categories);
  const { types } = useSelector((state) => state.types);

  useEffect(() => {
    dispatch(categoryList());
    dispatch(typeList());
  }, [dispatch]);

  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const pickImage = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    // Use FileReader to create data URLs (URIs) for each selected image
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Create a URI for each image and add to the preview and image state
        newImages.push(reader.result); // Add URI to newImages array

        // Update state after all images are processed
        if (newImages.length === files.length) {
          setImage((prevImages) => [...prevImages, ...files]);
          setImagePreview((prevPreviews) => [...prevPreviews, ...newImages]);
        }
      };

      reader.readAsDataURL(file); // Start reading the file as a data URL
    });
  };

  const deleteImage = (index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreview((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handleTypeChange = (selectedOptions) => {
    setSelectedTypes(selectedOptions);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!productName || !description || image.length === 0) {
      alert("Please fill all the fields");
      return;
    }

    const selectedCategoryIds = selectedCategories.map((category) => category.value);
    const selectedTypeIds = selectedTypes.map((type) => type.value);

    const productItem = {
      productName: productName,
      description: description,
      category: selectedCategoryIds,
      type: selectedTypeIds,
      image: image, // Send image file objects to the backend
      user: coopId,
    };

    console.log("Submitting product:", productItem);

    // Handle only "Add Product" action
    dispatch(createCoopProducts(productItem, token));

    onClose();
  };

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));

  const typeOptions = types.map((type) => ({
    value: type._id,
    label: type.typeName,
  }));

  return (
    show && (
      <div className="product-modal-overlay">
        <div className="product-modal-container">
          <h2>Add Product</h2>
          <form onSubmit={handleSaveProduct}>
            <div className="product-form-group">
              <label>Product Name:</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                placeholder="Enter product name"
              />
            </div>
            <div className="product-form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter product description"
              />
            </div>
            <div className="product-form-group">
              <label>Select Categories:</label>
              <Select
                isMulti
                value={selectedCategories}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="Select Categories"
              />
            </div>
            <div className="product-form-group">
              <label>Select Types:</label>
              <Select
                isMulti
                value={selectedTypes}
                onChange={handleTypeChange}
                options={typeOptions}
                placeholder="Select Types"
              />
            </div>
            <div className="product-form-group">
              <label>Product Images:</label>
              <input
                type="file"
                accept="image/*"
                onChange={pickImage}
                multiple
              />
              <div className="image-preview">
                {imagePreview.map((img, index) => (
                  <div key={index} className="image-item">
                    <img src={img} alt={`Product Image ${index}`} />
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      className="delete-image-button"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="product-btn-submit-product">
              Add Product
            </button>
          </form>
          <button className="product-btn-close-product" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default AddUpdateProduct;