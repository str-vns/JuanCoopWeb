import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRankedProducts } from "@redux/Actions/rankActions";
import { useNavigate } from "react-router-dom";
import BarGraph from "@assets/css/BarGraph";
import Sidebar from "../sidebar";
import "@assets/css/rankProduct.css";

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
    <div className="container">
      <Sidebar/>
      <div className="header-title">
        <h1 className="">Ranked Products</h1>
      </div>
      {loading && <div className="loader">Loading...</div>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && transformedProducts.length > 0 && (
        <BarGraph rankedProducts={transformedProducts} />
      )}
    </div>
  );
};

export default RrankProduct;
