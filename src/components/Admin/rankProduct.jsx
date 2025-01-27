import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRankedProducts } from "@redux/Actions/rankActions";
import { useNavigate } from "react-router-dom";
import BarGraph from "../../assets/css/BarGraph";
import Sidebar from "./sidebar";
import { IoArrowBackOutline } from "react-icons/io5"; // Using react-icons for the back button
import styles from "../../assets/css/rankProduct";

const rankProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the ranked products, loading, and error from the Redux state
  const { rankedProducts, loading, error } = useSelector((state) => state.rank);

  useEffect(() => {
    // Dispatch the action to fetch ranked products
    dispatch(getRankedProducts());
  }, [dispatch]);

  // Transform the ranked products for the graph
  const transformedProducts = Array.isArray(rankedProducts)
    ? rankedProducts.map((product, index) => ({
        name: product.productId || `Product ${index + 1}`, // Use productId or fallback
        rank: product.totalQuantitySold || 0, // Use totalQuantitySold
      }))
    : [];

  return (
    <div style={styles.container}>
      <Sidebar/>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Ranked Products</h1>
      </div>
      {loading && <div style={styles.loader}>Loading...</div>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && transformedProducts.length > 0 && (
        <BarGraph rankedProducts={transformedProducts} />
      )}
    </div>
  );
};

export default rankProduct;
