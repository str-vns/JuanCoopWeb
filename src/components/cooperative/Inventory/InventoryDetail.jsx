import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { IoPencil, IoTrash } from "react-icons/io5";
import { inventoryProducts, deleteInventory } from "@redux/Actions/inventoryActions";
import { getToken } from "@utils/helpers";
import Header from "../header";
import Sidebar from "../sidebar";
import "@assets/css/inventorylist.css";
import InventoryCreate from "./InventoryCreate";
import InventoryUpdate from "./InventoryUpdate";

const InventoryDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const InvItem = location.state?.Inv;

  const token = getToken();
  const { Invloading, Invsuccess } = useSelector((state) => state.sinvent);
  const [isInventoryCreateOpen, setInventoryCreateOpen] = useState(false);
  const [isInventoryUpdateOpen, setInventoryUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!InvItem) {
      navigate("/inventorylist");
    }
  }, [InvItem, navigate]);

  useEffect(() => {
    if (token && InvItem?._id) {
      dispatch(inventoryProducts(InvItem._id, token));
    }
  }, [dispatch, token, InvItem]);

  const handleEdit = (item) => {
    setSelectedItem(item); // Set the selected item
    setInventoryUpdateOpen(true); // Open the modal
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteInventory(id, token));
    }
  };

  const handleCreateInventory = () => {
    setInventoryCreateOpen(true);
    setSelectedItem(InvItem); 
  };  

  return (
    <div className="inventory-list-container">
      <Sidebar />
      <div className="inventory-list-content flex-1 flex flex-col">
        {/* <Header /> */}
        <div className="inventory-container">
          <div className="inventory-header">
            <h1>Inventory Detail</h1>
            <button className="btn btn-primary" onClick={handleCreateInventory}>
              Add Inventory
            </button>
          </div>
          {Invloading ? (
            <div className="loader">Loading inventory details...</div>
          ) : Invsuccess?.length > 0 ? (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Unit Name</th>
                  <th>Metric Unit</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Invsuccess.map((item) => (
                  <tr key={item._id}>
                    <td>{item.unitName || "N/A"}</td>
                    <td>{item.metricUnit || "N/A"}</td>
                    <td>{item.quantity || 0}</td>
                    <td>${item.price?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span
                        className={`status ${
                          item.status?.toLowerCase() === "active" ? "active" : "inactive"
                        }`}
                      >
                        {item.status
                          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                        <IoPencil /> Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                        <IoTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No inventory items found.</div>
          )}
          {isInventoryCreateOpen && (
            <InventoryCreate
              onClose={() => setInventoryCreateOpen(false)}
              productId={selectedItem?._id}
            />
          )}
          {isInventoryUpdateOpen && (
            <InventoryUpdate
              onClose={() => setInventoryUpdateOpen(false)}
              item={selectedItem}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;