import React, { useState, useEffect, useCallback, useContext } from "react";

import Sidebar from "../sidebar";
import { FaRedo, FaTrash } from "react-icons/fa";
import "@assets/css/productarchive.css";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  archiveProducts,
  restoreProducts,
  deleteProducts,
} from "@redux/Actions/productActions";

const ProductArchive = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { loading, coopProducts, error } = useSelector(
    (state) => state.CoopProduct
  );
  const currentUser = getCurrentUser();
  const Coopid = currentUser?._id;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
      dispatch(restoreProducts(id)).then(() => {
        dispatch(archiveProducts(Coopid));
      });
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
        dispatch(deleteProducts(id)).then(() => {
          dispatch(archiveProducts(Coopid));
        });
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setRefresh(false);
      }
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = coopProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(coopProducts.length / itemsPerPage);

  return (
    <div className="archive-container">
      <Sidebar />
      <div className="content-area">
        <div className="main-content">
          <div className="archive-header">
            <h1 className="archive-title">Product Archive</h1>
          </div>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : coopProducts.length === 0 ? (
            <p>No archived products available.</p>
          ) : (
            <>
              <div className="table-container">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={
                              product.image?.[0]?.url ||
                              "/default-placeholder.png"
                            }
                            alt={product.productName || "Product Image"}
                            className="product-image"
                          />
                        </td>
                        <td>{product.productName}</td>
                        <td>{product.description}</td>
                        {/* <td>
                            <button className="restore-button" onClick={() => handleRestore(product._id)}>
                              <FaRedo />
                            </button>
                            <button className="delete-button" onClick={() => handleDelete(product._id)}>
                              <FaTrash />
                            </button>
                          </td> */}
                        <td>
                          <i
                            className="fa-solid fa-rotate-right restore-icon"
                            onClick={() => handleRestore(product._id)}
                          ></i>
                          <i
                            className="fa-solid fa-trash delete-icon"
                            onClick={() => handleDelete(product._id)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="pagination">
                <button
                  className={`pagination-button ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={`pagination-button ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductArchive;
