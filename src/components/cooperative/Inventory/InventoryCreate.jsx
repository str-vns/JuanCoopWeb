import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createInventory } from "@redux/Actions/inventoryActions";
import { getToken } from "@utils/helpers";
import "@assets/css/inventorycreate.css";
import { FaTimes } from "react-icons/fa"; // Close Icon

const InventoryCreate = ({ onClose, productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [unitName, setUnitName] = useState("");
  const [metricUnit, setMetricUnit] = useState("kg");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const { Invloading, Inverror } = useSelector((state) => state.invent);
  const token = getToken();

  useEffect(() => {
    if (Inverror) {
      setError(Inverror);
      setTimeout(() => setError(""), 3000);
    }
  }, [Inverror]);

  const handleCreateInventory = async (e) => {
    e.preventDefault();

    if (!unitName || !unitPrice || !quantity) {
      setError("Please fill all fields.");
      return;
    }
    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    if (quantity > 100) {
      setError("Quantity must not exceed 100.");
      return;
    }
    if (unitPrice <= 0) {
      setError("Price must be greater than ₱0.");
      return;
    }
    if (unitPrice > 20000) {
      setError("Price must not exceed ₱20,000.");
      return;
    }

    const data = {
      unitName,
      metricUnit,
      price: unitPrice,
      quantity,
      productId,
    };

    try {
      const response = await dispatch(createInventory(data, token));
      if (response === true) {
        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 2000);
      }
      navigate(`/inventorydetail`, { state: { Inv: { _id: productId } } });
    } catch (error) {
      setError("Failed to create inventory. Please try again.");
    }

    onClose();
  };

  return (
    <div className="inv-create-modal-overlay">
      <div className="inv-create-modal-container">
        <button className="inv-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Add Inventory</h2>
        <form onSubmit={handleCreateInventory}>
          <label>Unit Name</label>
          <input
            type="text"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            placeholder="Enter unit name"
          />
          
          <label>Metric Unit</label>
          <select value={metricUnit} onChange={(e) => setMetricUnit(e.target.value)}>
            <option value="kg">KG</option>
            <option value="lb">LB</option>
            <option value="g">G</option>
            <option value="l">L</option>
            <option value="ml">ML</option>
            <option value="pcs">PCS</option>
            <option value="oz">OZ</option>
          </select>

          <label>Price</label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="Enter price"
          />
          
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />

          {error && <p className="inv-create-error">{error}</p>}

          <button type="submit" className="inv-submit-btn" disabled={Invloading}>
            {Invloading ? "Adding..." : "Add Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryCreate;