import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRankedProducts } from "@redux/Actions/rankActions";
import { useNavigate } from "react-router-dom";
import BarGraph from "../../assets/css/BarGraph";
import Sidebar from "./sidebar";
import { IoArrowBackOutline } from "react-icons/io5"; // Using react-icons for the back button

const RankedProductsPage = () => {
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

export default RankedProductsPage;

// Inline styles object
const styles = {
  container: {
    padding: "16px",
    backgroundColor: "#fff",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    width: "calc(100% - 400px)", // Corrected the syntax for `calc`
    marginLeft: "300px", // Corrected the syntax for `margin-left`
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  backButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    marginRight: "10px",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    alignItems: "center",
  },
  loader: {
    fontSize: "18px",
    textAlign: "center",
    margin: "20px 0",
  },
  error: {
    color: "red",
    fontSize: "16px",
    textAlign: "center",
  },
};
