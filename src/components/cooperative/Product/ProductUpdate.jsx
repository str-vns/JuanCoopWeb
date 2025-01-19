import React, { useState, useEffect } from "react";
import "../../../assets/css/addupdateproduct.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryList } from "../../../redux/Actions/categoryActions";
import { typeList } from "../../../redux/Actions/typeActions";
import { updateCoopProducts } from "../../../redux/Actions/productActions";
import { getToken, getCurrentUser } from "@utils/helpers";

const ProductUpdate = ({ props, show, onClose, product }) => {
  const singleProduct = props.route.params.item;
  const dispatch = useDispatch();
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState([]);
  const [newImage, setNewImage] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const { categories } = useSelector((state) => state.categories);
  const { types } = useSelector((state) => state.types);

  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;
  const productId = singleProduct?._id;

  useEffect(() => {
    const loadProductData = () => {
      const matchingCats = categories.filter((cat) => product.category.includes(cat._id));
      setSelectedCategories(matchingCats.map((cat) => ({ id: cat._id, name: cat.categoryName })));

      const matchingTypes = types.filter((type) => product.type.includes(type._id));
      setSelectedTypes(matchingTypes.map((type) => ({ id: type._id, name: type.typeName })));

      const imageURLs = product.image.map((imageObj) => imageObj.url);
      setImage(imageURLs);
    };

    if (product) {
      loadProductData();
    }
    setProductName(product.productName);
    setDescription(product.description);
  }, [product, categories, types]);

  useEffect(() => {
    dispatch(categoryList());
    dispatch(typeList());
  }, [dispatch]);

  const pickImage = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      if (!image.includes(fileURL)) {
        newImages.push(fileURL);
      }
    });

    setImage((prevImages) => [...prevImages, ...newImages]);
    setNewImage(newImages);
  };

  const deleteImage = (index) => {
    setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    dispatch(imageDel(productId, imageId));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.some((cat) => cat.id === categoryId)
        ? prev.filter((cat) => cat.id !== categoryId)
        : [...prev, { id: categoryId, name: categories.find((cat) => cat._id === categoryId)?.categoryName }]
    );
  };

  const handleTypeChange = (typeId) => {
    setSelectedTypes((prev) =>
      prev.some((type) => type.id === typeId)
        ? prev.filter((type) => type.id !== typeId)
        : [...prev, { id: typeId, name: types.find((type) => type._id === typeId)?.typeName }]
    );
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!productName || !description || !image.length) {
      alert("Please fill in all required fields.");
      return;
    }

    const productItem = {
      productName,
      description,
      stock: parseInt(stock),
      category: selectedCategories.map((cat) => cat.id),
      type: selectedTypes.map((type) => type.id),
      pricing: price,
      image: newImage,
    };

    dispatch(updateCoopProducts(productId, productItem, token));
    onClose();
  };

  return (
    show && (
      <div className="product-modal-overlay">
        <div className="product-modal-container">
          <h2>Update Product</h2>
          <form onSubmit={handleSaveProduct}>
            <div className="form-group">
              <label>Product Name:</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock quantity"
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>
            <div className="form-group">
              <label>Categories:</label>
              <div className="checkbox-group">
                {categories.map((cat) => (
                  <label key={cat._id}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.some((selected) => selected.id === cat._id)}
                      onChange={() => handleCategoryChange(cat._id)}
                    />
                    {cat.categoryName}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Types:</label>
              <div className="checkbox-group">
                {types.map((type) => (
                  <label key={type._id}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.some((selected) => selected.id === type._id)}
                      onChange={() => handleTypeChange(type._id)}
                    />
                    {type.typeName}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Product Images:</label>
              <input type="file" onChange={pickImage} multiple />
              <div className="image-preview">
                {image.map((img, index) => (
                  <div key={index} className="image-item">
                    <img src={img} alt={`Product Image ${index}`} />
                    <button type="button" onClick={() => deleteImage(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ProductUpdate;