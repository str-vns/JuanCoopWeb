import React, { useState, useEffect } from "react";
import "../../assets/css/home.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import axios from "axios";
import { getCurrentUser } from "@utils/helpers";
import { useSocket } from "../../../SocketIo";



const CategorySection = ({ categories }) => {
  const socket = useSocket();
  const user = getCurrentUser();
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
  if (socket && getCurrentUser()) {
     socket.emit("addUser", user._id)
     socket.on("getUsers", (users) => {
      const onlineUsers = users.filter(user => user.online && user._id !== null);
     
      setOnlineUsers(onlineUsers);  
    });
  
    return () => {
      socket.off("getUsers");
    };
  }
}, [socket, user]);

  return (
    <div className="p-11 rounded-md shadow-sm bg-white w-1/4 mx-auto ">
      <div className="text-center mb-4">
        <h1 className="text-lg font-semibold">All Categories</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div className="text-center" key={category._id}>
              <img
                src={category.image.url}
                alt={category.categoryName}
                className="w-20 h-20 rounded-full object-cover mx-auto border border-gray-300"
              />
              <p className="text-sm mt-2">{category.categoryName}</p>
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
    // Retrieve cart from local storage or initialize as empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item.id === id);
  
    if (existingProduct) {
      // If the product exists, increase the quantity by 1
      existingProduct.quantity += 1;
    } else {
      // Otherwise, add the new product with quantity 1
      cart.push({ id, name, price, image, quantity: 1 });
    }
  
    // Save the updated cart back to local storage
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  const handleProductClick = () => {
    // Navigate to the product detail page using the product ID
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
          <div
            className="product-card-add-to-cart bg-green-500 text-white p-2 rounded-full"
            onClick={handleAddToCart} 
          >
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>
    </div>
  );
};


// Main Product List Component
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
  
        // Fetch products
        const productsResponse = await axios.get(`${baseURL}products`);
        const fetchedProducts = productsResponse.data.details || [];
  
        // Fetch inventory
        const inventoryResponse = await axios.get(`${baseURL}inventory`);
        const fetchedInventory = inventoryResponse.data.details || [];
  
        // Fetch categories
        const categoriesResponse = await axios.get(`${baseURL}category`);
        const fetchedCategories = categoriesResponse.data.details || [];
  
        // Match products with their corresponding inventory data
        const combinedData = fetchedProducts.map((product) => {
          const matchingInventory = fetchedInventory.find(
            (item) => item.productId.toString() === product._id.toString()
          );
          return {
            ...product,
            price: matchingInventory?.price || "N/A", // Attach price if available
            quantity: matchingInventory?.quantity || 0, // Attach quantity if available
            metricUnit: matchingInventory?.metricUnit || "", // Attach metric unit if available
            unitName: matchingInventory?.unitName || "", // Attach unit name if available
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
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-container flex">
      <Navbar />
      <CategorySection categories={categories} />

      <div className="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-2">
        {products.map((product) => (
          <Homepage
            key={product._id}
            id={product._id} // Pass the product ID here
            image={product.image[0]?.url}
            name={product.productName}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
