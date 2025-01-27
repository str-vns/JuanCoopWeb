import React, { useState } from "react";
import "@assets/css/wishlist.css"; // Import CSS file
import Navbar from "../layout/navbar";

// Wishlist Component
const WishList = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "AMPALAYA",
      price: 30,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "APPLE",
      price: 100,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "ORANGE",
      price: 150,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "EGG PLANT",
      price: 50,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 5,
      name: "BANANA",
      price: 25,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 6,
      name: "PINEAPPLE",
      price: 120,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 7,
      name: "WATERMELON",
      price: 90,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 8,
      name: "MANGO",
      price: 70,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 9,
      name: "PAPAYA",
      price: 80,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 10,
      name: "GRAPES",
      price: 200,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 11,
      name: "PEACH",
      price: 180,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 12,
      name: "KIWI",
      price: 160,
      image: "https://via.placeholder.com/100",
    },
  ];

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = wishlistItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="wishlist-container">
      <Navbar />
      {/* Wishlist Grid */}
      <div className="wishlist-grid">
        {paginatedItems.map((item) => (
          <WishListCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

// WishListCard Component
const WishListCard = ({ item }) => {
  return (
    <div className="wishlist-card">
      <img src={item.image} alt={item.name} className="wishlist-image" />
      <div className="wishlist-info">
        <h3 className="wishlist-name">{item.name}</h3>
        <p className="wishlist-price">₱{item.price}.00</p>
      </div>
      <div className="wishlist-icons">
        <i className="fa-solid fa-trash icon trash-icon"></i>
        <i className="fa-solid fa-basket-shopping icon basket-icon"></i>
      </div>
    </div>
  );
};

export default WishList;
