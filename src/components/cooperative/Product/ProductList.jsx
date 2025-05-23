import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCoopProducts,
  createCoopProducts,
  updateCoopProducts,
  soflDelProducts,
} from "@redux/Actions/productActions";
import ProductUpdate from "./ProductUpdate";
// import Header from "../header";
import Sidebar from "../sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getToken, getCurrentUser } from "@utils/helpers";
import axios from "axios";
import baseURL from "@Commons/baseUrl";
import ProductCreate from "./ProductCreate";
import "@assets/css/productlist.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const { coopProducts, loading, error } = useSelector(
    (state) => state.CoopProduct
  );
  const { success: createSuccess } = useSelector(
    (state) => state.productCreate || {}
  );
  const { success: updateSuccess } = useSelector(
    (state) => state.productUpdate || {}
  );
  const { success: deleteSuccess } = useSelector(
    (state) => state.productDelete || {}
  );

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    if (token || coopId) {
      dispatch(getCoopProducts(coopId, token));
    }

    axios.get(`${baseURL}category`).then((response) => {
      setCategories(Array.isArray(response.data) ? response.data : []);
    });

    axios.get(`${baseURL}type`).then((response) => {
      setTypes(Array.isArray(response.data) ? response.data : []);
    });
  }, [dispatch, coopId, createSuccess, updateSuccess, deleteSuccess]);

  const handleAddProduct = (product) => {
    dispatch(createCoopProducts(product, getToken()));
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    dispatch(updateCoopProducts(updatedProduct.id, updatedProduct, getToken()));
    setIsUpdateModalOpen(false);
    setProductToUpdate(null);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(soflDelProducts(productToDelete)).then(() => {
        dispatch(getCoopProducts(coopId, token));
      });
    }
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const filteredProducts =
    coopProducts
      ?.filter((product) =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  // if (error)
  //   return (
  //     <p className="text-center text-red-500">{`Error loading products: ${error}`}</p>
  //   );

  return (
    <div className="product-list-container">
      <Sidebar />
      <div className="product-list-containertwo">
        {/* <Header /> */}
        <main className="p-6">
          <div className="product-list-header">
            <h1>All Products</h1>
            <button
              className="btn-add-product"
              onClick={() => setIsAddModalOpen(true)}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>

          <div className="product-table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={
                          product.image?.[0]?.url || "/default-placeholder.png"
                        }
                        alt={product.productName || "Product Image"}
                        className="product-image"
                      />
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>{product.stock?.[0]?.price || "N/A"}</td>
                    <td>{product.stock?.[0]?.quantity || 0}</td>
                    <td className="actions-column">
                      <span
                        className="icon-update"
                        onClick={() => {
                          console.log("Updating product:", product);
                          setProductToUpdate(product);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span
                        className="icon-delete"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {isAddModalOpen && (
            <ProductCreate
              show={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false);
                window.location.reload();
              }}
              onSubmit={handleAddProduct}
            />
          )}
          {isUpdateModalOpen && (
            <ProductUpdate
              show={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              onSubmit={handleUpdateProduct}
              product={productToUpdate || {}}
            />
          )}
          {isDeleteModalVisible && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this product?</p>
                <div className="modal-buttons">
                  <button className="modal-ok-btn" onClick={confirmDelete}>
                    Yes
                  </button>
                  <button className="modal-cancel-btn" onClick={cancelDelete}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
