import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { IoPencil, IoTrash } from "react-icons/io5";
import { inventoryProducts, deleteInventory } from "@redux/Actions/inventoryActions";
import { getToken } from "@utils/helpers";
import Header from "../header";
import Sidebar from "../sidebar";
import "@assets/css/inventorydetail.css";
import InventoryCreate from "./InventoryCreate";
import InventoryUpdate from "./InventoryUpdate";
import { FaEdit, FaTrash } from "react-icons/fa";

const InventoryDetail = () => {
  const dispatch = useDispatch();
  const token = getToken();

  const navigate = useNavigate();
  const location = useLocation();
  const InvItem = location.state?.Inv;

  const { Invsuccess } = useSelector((state) => state.sinvent);
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
    setSelectedItem(item);
    setInventoryUpdateOpen(true);
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
      <div className="inventory-list-containertwo">
        <main className="p-6">
          <div className="inventory-header">
            <h1>Inventory Detail</h1>
            <button className="btn-add-inventory" onClick={handleCreateInventory}>
              Add Inventory
            </button>
          </div>
          {Invsuccess?.length > 0 ? (
            <div className="inventory-table-container">
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
                      <td className="action-buttons">
                        <button className="btn btn-update" onClick={() => handleEdit(item)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-delete" onClick={() => handleDelete(item._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No inventory items found.</div>
          )}
          {isInventoryCreateOpen && (
            <InventoryCreate
              show={isInventoryCreateOpen}  // ✅ Pass `show` prop
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
        </main>
      </div>
    </div>
  );
};

export default InventoryDetail;