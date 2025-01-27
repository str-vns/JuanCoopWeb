import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { updateInventory } from "@redux/Actions/inventoryActions";
import "@assets/css/inventoryupdate.css";
import { getToken } from "@utils/helpers";

const InventoryUpdate = ({ onClose, item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getToken();

  const location = useLocation();
  const InvItem = location.state?.Inv;
  const { Invloading, Inverror } = useSelector((state) => state.invent);

  const [unitName, setUnitName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [metricUnit, setMetricUnit] = useState("");
  const [errors, setErrors] = useState("");


  // Ensure the item is present before setting state values
  useEffect(() => {
    if (item) {
      console.log("Received item:", item);
      setUnitName(item.unitName);
      setUnitPrice(item.price.toString());
      setQuantity(item.quantity.toString());
      setMetricUnit(item.metricUnit);
    }
  }, [item]);

  const handleUpdateInventory = (item, inventoryId) => {

    if (!unitName || !unitPrice || !quantity) {
      setErrors("Please fill all fields");
    } else if (quantity <= 0) {
      setErrors("Quantity must be greater than 0");
    } else if (quantity > 100) {
      setErrors("Quantity must not exceed 100");
    } else if (unitPrice > 20000) {
      setErrors("Price must not exceed ₱20,000");
    } else if (unitPrice <= 0) {
      setErrors("Price must be greater than ₱0");
    } else {
      const inventory = {
        unitName,
        metricUnit,
        price: unitPrice,
        quantity,
        productId: InvItem._id
      };

      dispatch(updateInventory(inventory, inventoryId, token));
      navigate("/inventorydetail");
    }

    setTimeout(() => setErrors(""), 3000);
  };

  return (
    <div className="inv-update-modal-overlay">
      <div className="inv-update-modal-container">
        <h2>Update Inventory</h2>
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
          {errors && <p className="inv-update-error">{errors}</p>}
        </form>
        <button disabled={Invloading} onClick={() => handleUpdateInventory(item, item._id)}>
          {Invloading ? "Updating..." : "Update"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default InventoryUpdate;