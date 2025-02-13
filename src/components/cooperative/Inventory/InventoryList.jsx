import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Header from "../header";
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

  return (
    <div className="inventory-list-container">
      <Sidebar />
      <div className="inventory-list-containertwo">
        {/* <Header /> */}
        <main className="p-6">
          <div className="inventory-header">
            <h1>Product Inventory List</h1>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
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
                {(coopProducts || [])
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
                  .map((item) => (
                    <tr key={item?._id}>
                      <td>
                        <img
                          src={item?.image[0]?.url || "https://via.placeholder.com/150"}
                          alt={item?.productName}
                          className="inventory-image"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>{item?.productName || "Unnamed Product"}</td>
                      <td>{item?.description || "No description available."}</td>
                      <td>
                        <button
                          className="inventory-view-button"
                          onClick={() => handleViewDetails(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryList;