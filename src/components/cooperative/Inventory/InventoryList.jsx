import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";
import { getCoopProducts } from "@redux/Actions/productActions";
import { useNavigate } from "react-router-dom";
import "@assets/css/inventorylist.css";

const InventoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();
  const currentUser = getCurrentUser();
  const coopId = currentUser?._id;

  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { loading, coopProducts, error } = useSelector(
    (state) => state.CoopProduct
  );

  useEffect(() => {
    if (coopId) {
      dispatch(getCoopProducts(coopId));
    }
  }, [dispatch, coopId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (coopId) {
        await dispatch(getCoopProducts(coopId));
      }
    } catch (err) {
      console.error("Error refreshing inventory:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, coopId]);

  const handleViewDetails = (item) => {
    navigate("/inventorydetail", { state: { Inv: item } });
  };

  // Pagination logic
  const filteredProducts =
    coopProducts?.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ) || [];
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="inventory-list-containers">
      <Sidebar />
      <div className="inventory-list-containertwo">
        <main className="p-6">
          <div className="inventory-header-list">
            <h1>Product Inventory List</h1>
          </div>
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((item) => (
                  <tr key={item?._id}>
                    <td>
                      <img
                        src={
                          item?.image[0]?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item?.productName}
                        className="inventory-image"
                      />
                    </td>
                    <td>{item?.productName || "Unnamed Product"}</td>
                    <td>{item?.description || "No description available."}</td>
                    <td>
                      <i
                        className="fa-solid fa-eye inventory-view-icon"
                        onClick={() => handleViewDetails(item)}
                      ></i>
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
        </main>
      </div>
    </div>
  );
};

export default InventoryList;
