import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import { FaRedo } from "react-icons/fa";
import "../css/productarchive.css";

const ProductArchive = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Education Dashboard", sku: "ED123", price: 149, stock: 50, status: "Active" },
    { id: 2, name: "React UI Kit", sku: "RE456", price: 129, stock: 30, status: "Inactive" },
    { id: 3, name: "E-Commerce Template", sku: "EC789", price: 199, stock: 20, status: "Inactive" },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleRestore = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, status: "Active" } : product
      )
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.status === statusFilter || statusFilter === "All") &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-area ${isSidebarOpen ? "with-sidebar" : "without-sidebar"}`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6 w-auto">
          <div className="archive-card">
            <div className="archive-header">
              <h1 className="archive-title">Product Archive</h1>
              <div className="archive-filters">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  onChange={(e) => setStatusFilter(e.target.value)}
                  value={statusFilter}
                  className="filter-select"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of stock">Out of stock</option>
                </select>
              </div>
            </div>
            <div className="table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Inventory</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.status}</td>
                      <td>
                        {product.status === "Inactive" && (
                          <button
                            className="restore-button"
                            onClick={() => handleRestore(product.id)}
                          >
                            <FaRedo />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button
                className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductArchive;