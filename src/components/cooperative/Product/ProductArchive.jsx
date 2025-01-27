import React, { useState, useEffect, useCallback, useContext } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaRedo, FaTrash } from "react-icons/fa";
import "@assets/css/productarchive.css";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { archiveProducts, restoreProducts, deleteProducts } from "@redux/Actions/productActions";

const ProductArchive = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { loading, coopProducts, error } = useSelector((state) => state.CoopProduct);
  const currentUser = getCurrentUser();
  const storedToken = getToken(); 
  const Coopid = currentUser?._id;

  useEffect(() => {
    dispatch(archiveProducts(Coopid));
  }, [dispatch, Coopid]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    dispatch(archiveProducts(Coopid));
    setRefresh(false);
  }, [dispatch, Coopid]);

  const handleRestore = (id) => {
    setRefresh(true);
    try {
      dispatch(restoreProducts(id));
      onRefresh();
    } catch (error) {
      console.error("Error restoring product:", error);
    } finally {
      setRefresh(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setRefresh(true);
      try {
        dispatch(deleteProducts(id));
        onRefresh();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setRefresh(false);
      }
    }
  };

  return (
    <div className="product-archive-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        {/* <Header /> */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="archive-card">
            <div className="archive-header">
              <h1 className="archive-title">Product Archive</h1>
              <button onClick={onRefresh} className="refresh-button">
                Refresh
              </button>
            </div>
            {loading ? (
              <p>Loading products...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : coopProducts.length === 0 ? (
              <p>No archived products available.</p>
            ) : (
              <div className="table-container">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coopProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.productName}</td>
                        <td>{product.description}</td>
                        <td>
                          <button className="restore-button" onClick={() => handleRestore(product._id)}>
                            <FaRedo color="green" />
                          </button>
                          <button className="delete-button" onClick={() => handleDelete(product._id)}>
                            <FaTrash color="red" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductArchive;