import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../../assets/css/productcreate.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryList } from "@redux/Actions/categoryActions";
import { typeList } from "@redux/Actions/typeActions";
import { updateCoopProducts, imageDel } from "@redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";

const ProductUpdate = ({ show, onClose, product }) => {
  const dispatch = useDispatch();
  const productId = product._id;
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  const { categories } = useSelector((state) => state.categories);
  const { types } = useSelector((state) => state.types);
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  useEffect(() => {
    if (product) {
      setProductName(product.productName || "");
      setDescription(product.description || "");
  const matchingCats = categories.filter((cat) => product.category.includes(cat._id));
      setSelectedCategories(
        matchingCats.map((cat) => ({ value: cat._id, label: cat.categoryName }))
      );
      
      const matchingTypes = types.filter((type) => product.type.includes(type._id));
      setSelectedTypes(
        matchingTypes.map((type) => ({ value: type._id, label: type.typeName }))
      );
      setImagesPreview(
        product.image?.map((img) => img.url) || []
      );
    }
    dispatch(categoryList());
    dispatch(typeList());
  }, [dispatch, product]);

  const handleUpdateProduct = async(e) => {
    e.preventDefault();

    if (!productName || !description || (!imagesPreview.length && !images.length)) {
      alert("Please fill all the fields");
      return;
    }

    const updatedData = {
      productName,
      description,
      category: selectedCategories.map((category) => category.value),
      type: selectedTypes.map((type) => type.value),
      image: newImages,
    };

    console.log("Updating product:", updatedData);
    const response = await dispatch(updateCoopProducts(product._id, updatedData, token));
    console.log("response", response);
    if (response === true) {
      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 5000);
  
    } else {
      alert("Failed to update product");
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handleTypeChange = (selectedOptions) => {
    setSelectedTypes(selectedOptions);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result]);
  
          setImages((prev) => [...prev, file]);
  
          setNewImages((prev) => [...prev, file]);
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

  const deleteImage = (imageId, index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(imageDel(productId, imageId));
    window.location.reload();
  };
  return (
    show && (
      <div className="product-modal-overlay ">
        <div className="product-modal-container">
          <h2>Update Product</h2>
          <form onSubmit={handleUpdateProduct}>
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
              <label
                htmlFor="customFile"
                className="px-4 py-2 border-2 border-black rounded-md cursor-pointer bg-white text-black hover:bg-black hover:text-white"
              >
                Choose Images
              </label>
              <div className="flex gap-4 overflow-x-auto">
  {imagesPreview.length > 0 &&
    imagesPreview.map((imageUri, index) => {
      const imageId = product.image[index]?._id; // Safely access image ID
      return (
        <div key={imageId || index} className="relative w-36 h-36 flex-shrink-0">
          <img
            src={imageUri}
            alt={`Uploaded ${index}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={() => deleteImage(imageId)}
            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-opacity-80"
          >
            ✖
          </button>
        </div>
      );
    })}
</div>

            </div>
            <button type="submit" className="product-btn-submit-product">
              Update Product
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

export default ProductUpdate;