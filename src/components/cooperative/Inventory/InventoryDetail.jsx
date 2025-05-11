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
import { toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles

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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalVisible(true); // Show the modal
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteInventory(itemToDelete, token)).then(() => {
        dispatch(inventoryProducts(InvItem._id, token));
        toast.success("Inventory item has been successfully deleted.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    }
    setIsDeleteModalVisible(false); // Hide the modal
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false); // Hide the modal
    setItemToDelete(null);
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
            <button className="btn-add-product" onClick={handleCreateInventory}>
              <i className="fa-solid fa-plus"></i>
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
                            item.status?.toLowerCase() === "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {item.status
                            ? item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="actions-column">
                        <span className="icon-update" onClick={() => handleEdit(item)}>
                          <FaEdit />
                        </span>
                        <span className="icon-delete" onClick={() => handleDeleteClick(item._id)}>
                          <FaTrash />
                        </span>
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
              show={isInventoryCreateOpen}
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
          {isDeleteModalVisible && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this inventory item?</p>
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

export default InventoryDetail;
