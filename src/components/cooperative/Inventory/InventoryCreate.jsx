import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams hook
import { createInventory } from "@redux/Actions/inventoryActions";
import { getToken } from "@utils/helpers";
import "../../../assets/css/inventorycreate.css";

const InventoryCreate = ({ onClose, productId }) => {
  // const { item } = useParams();
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

  const handleCreateInventory = (item) => {
    if (!unitName || !unitPrice || !quantity) {
      setError("Please fill all fields.");
    } else if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
    } else if (quantity > 100) {
      setError("Quantity must not exceed 100.");
    } else if (unitPrice <= 0) {
      setError("Price must be greater than ₱0.");
    } else if (unitPrice > 20000) {
      setError("Price must not exceed ₱20,000.");
    } else {
      const data = {
        unitName,
        metricUnit,
        price: unitPrice,
        quantity,
        productId,
      };
      dispatch(createInventory(data, token));
      navigate(`/inventorydetail`, { state: { Inv: { _id: productId } } });
    }

    setTimeout(() => setError(""), 3000);
    onClose();
  };

  return (
    <div className="inv-create-modal-overlay">
      <div className="inv-create-modal-container">
        <h2>Add Inventory</h2>
        <form>
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
        </form>
        <button disabled={Invloading} onClick={handleCreateInventory}>
          {Invloading ? "Adding..." : "Add"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default InventoryCreate;