import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCoopProducts } from "@redux/Actions/productActions";
import axios from "axios";
import baseURL from "@Commons/BaseUrl";
import "@assets/css/productcard.css";

const FarmerProfile = () => {
  const { coopId } = useParams();
  const dispatch = useDispatch();

  // Local state for cooperative details
  const [coopDetails, setCoopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redux state for products
  const products = useSelector(
    (state) => state?.CoopProduct?.coopProducts || []
  );
  console.log("Products from Redux:", products);

  const productLoading = useSelector((state) => state?.CoopProduct?.loading);
  console.log(
    "Redux state:",
    useSelector((state) => state)
  );

  
  useEffect(() => {
    const fetchCoopDetails = async () => {
        try {
          setLoading(true);
      
          if (!coopId) {
            throw new Error("Cooperative ID is missing");
          }
      
          const { data } = await axios.get(`${baseURL}farm/${coopId}`);
      
          if (!data.details) {
            throw new Error("Cooperative details not found");
          }
      
          setCoopDetails(data.details);
      
          console.log("Fetched Cooperative Details:", data.details);
          console.log("Farm ID:", data.details._id);
          console.log("User ID being sent:", data.details?.user?._id); // Log User ID
      
          const userId = data.details?.user?._id; // Extract User ID
      
          if (typeof userId === "string") {
            dispatch(getCoopProducts(userId)); // Send User ID instead of Farm ID
          } else {
            throw new Error("Invalid User ID: " + JSON.stringify(userId));
          }
      
        } catch (err) {
          setError(err.message || "Failed to fetch cooperative details");
        } finally {
          setLoading(false);
        }
      };
      
      
     

    fetchCoopDetails();
  }, [coopId, dispatch]);

  if (loading || productLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="farmer-profile-container">
      {coopDetails && (
        <div className="coop-details">
          <img
            src={coopDetails?.user?.image?.url || "/default-profile.jpg"}
            alt="Cooperative"
            className="coop-image"
          />
          <h2>{coopDetails.farmName}</h2>
          <p>
            <strong>Location:</strong> {coopDetails.barangay},{" "}
            {coopDetails.city}
          </p>
        </div>
      )}

      <h3>Products</h3>
      <div className="product-list">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product?._id || Math.random()} className="product-card">
              <img
                src={product?.image?.[0]?.url || "/placeholder.png"}
                alt={product?.productName || "Product"}
                className="product-image"
              />
              <h4>{product?.productName || "Unnamed Product"}</h4>
              <p>₱ {product?.stock?.[0]?.price || "N/A"}</p>
              <a href={`/product/${product?._id}`} className="view-product-btn">
                View Product
              </a>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default FarmerProfile;
