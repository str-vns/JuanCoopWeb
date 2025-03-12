import React, { useState, useEffect } from "react";
import "@assets/css/home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import axios from "axios";
import { getCurrentUser } from "@utils/helpers";
import { useSocket } from "../../../SocketIo";
import baseURL from '@Commons/baseUrl';

// Category Section Component
const CategorySection = ({ categories, onCategorySelect }) => {
  return (
    <div className="p-11 rounded-md shadow-sm bg-white w-1/4 mx-auto ">
      <div className="text-center mb-4">
        <h1 className="text-lg text-black font-semibold">All Categories</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div 
              className="text-center cursor-pointer" 
              key={category._id}
              onClick={() => {
                console.log("Selected Category:", category.categoryName);
                onCategorySelect(category.categoryName);
              }}
            >
              <img
                src={category.image.url}
                alt={category.categoryName}
                className="w-20 h-20 rounded-full object-cover mx-auto border border-gray-300"
              />
              {/* <p className="text-sm mt-2">{category.categoryName}</p> */}
              <p className="text-lg font-bold text-black mt-2">{category.categoryName}</p>

            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
};




// Product Card Component
const Homepage = ({ image, name, price, id }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="product-card border rounded-md shadow-md p-4"
      onClick={handleProductClick}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="product-card-content mt-2">
        <p className="product-card-name font-medium">{name}</p>
        <div className="product-card-price flex items-center justify-between">
          <p className="product-card-price-current font-bold text-lg">
            ₱{price}
          </p>
          {/* <div
            className="product-card-add-to-cart bg-green-500 text-white p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Main Product List Component
// Main Product List Component
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`${baseURL}products`);
        const fetchedProducts = productsResponse.data.details || [];
        console.log("Fetched Products:", fetchedProducts);

        const inventoryResponse = await axios.get(`${baseURL}inventory`);
        const fetchedInventory = inventoryResponse.data.details || [];

        const categoriesResponse = await axios.get(`${baseURL}category`);
        const fetchedCategories = categoriesResponse.data.details || [];
        console.log("Fetched Categories:", fetchedCategories);

        const combinedData = fetchedProducts.map((product) => {
          const matchingInventory = fetchedInventory.find(
            (item) => item.productId.toString() === product._id.toString()
          );
        
          const categoryNames = product.category.map((catId) => {
            const category = fetchedCategories.find(
              (cat) => cat._id.toString() === catId.toString()
            );
            return category?.categoryName || "Uncategorized";
          });
        
          return {
            ...product,
            category: categoryNames, // Use category names instead of IDs
            price: matchingInventory?.price || "N/A",
            quantity: matchingInventory?.quantity || 0,
            metricUnit: matchingInventory?.metricUnit || "",
            unitName: matchingInventory?.unitName || "",
          };
        });

        setProducts(combinedData);
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category.includes(selectedCategory) : true;
    const matchesSearchQuery = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  console.log("Filtered Products:", filteredProducts);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-container flex">
      <Navbar />
      <CategorySection 
        categories={categories} 
        onCategorySelect={(category) => setSelectedCategory(category)} 
      />

      <div className="w-full p-4">
        {/* Search Bar */}
        <div className="user-search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
          />
        </div>

        <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Homepage
                key={product._id}
                id={product._id}
                image={product.image[0]?.url}
                name={product.productName}
                price={product.price}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};




export default ProductList;
