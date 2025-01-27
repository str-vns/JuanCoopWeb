import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRankedProducts } from "@redux/Actions/rankActions";
import { useNavigate } from "react-router-dom";
import BarGraph from "../../assets/css/BarGraph";
import Sidebar from "./sidebar";
import styles from "../../assets/css/rankProduct";

const RrankProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rankedProducts, loading, error } = useSelector((state) => state.rank);

  useEffect(() => {
    dispatch(getRankedProducts());
  }, [dispatch]);

  const transformedProducts = Array.isArray(rankedProducts)
    ? rankedProducts.map((product, index) => ({
        name: product.productId || `Product ${index + 1}`, 
        rank: product.totalQuantitySold || 0,
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

export default RrankProduct;
