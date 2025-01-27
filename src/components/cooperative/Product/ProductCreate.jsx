import React, { useState, useEffect } from "react";
import Select from "react-select";
import "@assets/css/productcreate.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryList } from "@redux/Actions/categoryActions";
import { typeList } from "@redux/Actions/typeActions";
import { createCoopProducts } from "@redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";

const ProductCreate = ({ show, onClose }) => {
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);

  const { categories } = useSelector((state) => state.categories);
  const { types } = useSelector((state) => state.types);

  const selectedCategoryIds = selectedCategories.map((category) => category.value);
  const selectedTypeIds = selectedTypes.map((type) => type.value);

  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!productName || !description || imagesPreview.length === 0) {
      alert("Please fill all the fields");
      return;
    }

    const data = {
      productName,
      description,
      category: selectedCategoryIds,
      type: selectedTypeIds,
      image: images,
      user: coopId,
    };

    console.log("Submitting product:", data);
    const response = await dispatch(createCoopProducts(data, token));
    if (response === true) {
      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 5000);
    }
    onClose();
  };

  useEffect(() => {
    dispatch(categoryList());
    dispatch(typeList());
  }, [dispatch]);

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handleTypeChange = (selectedOptions) => {
    setSelectedTypes(selectedOptions);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };
      reader.readAsDataURL(file);
    });
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
              <input
                type="file"
                name="images"
                className="custom-file-input hidden"
                id="customFile"
                accept="image/*"
                onChange={onChange}
                multiple
              />
              <label htmlFor="customFile" className="file-upload-btn">
                Choose Images
              </label>
              <div className="image-preview">
                {imagesPreview.map((img, index) => (
                  <img src={img} key={index} alt={`Preview ${index}`} width="55" height="52" />
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

export default ProductCreate;