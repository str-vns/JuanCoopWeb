import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCoopProducts,
  createCoopProducts,
  updateCoopProducts,
  deleteProducts,
} from "../../../redux/Actions/productActions";
import ProductUpdate from "./ProductUpdate";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getToken, getCurrentUser } from "@utils/helpers";
import axios from "axios";
import baseURL from "@Commons/baseUrl";
import AddUpdateProduct from "./AddUpdateProduct";
import "../css/productlist.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const { coopProducts, loading, error } = useSelector((state) => state.CoopProduct);
  const { success: createSuccess } = useSelector((state) => state.productCreate || {});
  const { success: updateSuccess } = useSelector((state) => state.productUpdate || {});
  const { success: deleteSuccess } = useSelector((state) => state.productDelete || {});

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleDelete = (productId) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if (confirm) {
      dispatch(deleteProducts(productId));
    }
  };

  const filteredProducts = coopProducts?.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{`Error loading products: ${error}`}</p>;

  return (
    <div className="product-list-container">
      <Sidebar />
      <div className="product-list-containertwo flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <div className="product-list-header">
            <h1>All Products</h1>
            <button className="btn-add-product" onClick={() => setIsAddModalOpen(true)}>
              Add Product
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
                        src={product.image?.[0]?.url || "/default-placeholder.png"}
                        alt={product.productName || "Product Image"}
                        className="product-image"
                      />
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>{product.stock?.[0]?.price || "N/A"}</td>
                    <td>{product.stock?.[0]?.quantity || 0}</td>
                    <td>
                      <button
                        className="btn btn-update"
                        onClick={() => {
                          console.log("Updating product:", product);
                          setProductToUpdate(product);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isAddModalOpen && (
            <AddUpdateProduct
              show={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
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
        </main>
      </div>
    </div>
  );
};

export default ProductList;