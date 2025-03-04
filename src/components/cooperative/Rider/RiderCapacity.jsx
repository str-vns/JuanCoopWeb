import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { maxCapacity } from "@redux/Actions/driverActions";
import "@assets/css/ridercapacity.css"; // Import your CSS file
import Sidebar from "../sidebar";

const RiderCapacity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const driverId = location.state?.driverId;

  const { Deliveryloading, errors } = useSelector((state) => state.driverApi);
  const [capacity, setCapacity] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJwt = () => {
      const res = localStorage.getItem("jwt");
      setToken(res);
    };
    fetchJwt();
  }, []);

  const handleCancel = () => {
    setCapacity("");
    navigate(-1);
  };

  const handleSave = () => {
    if (!capacity) {
      setError("Please Add Number of Capacity");
      return;
    } else if (isNaN(capacity)) {
      setError("Capacity must be a number");
      return;
    } else if (capacity < 5) {
      setError("Capacity must be greater than 4");
      return;
    }

    const data = { capacity };
    dispatch(maxCapacity(driverId, data, token));

    setCapacity("");
    navigate("/riderlist");
  };

  return (
    <div className="rider-capacity-container">
      <Sidebar/>
      <section className="form-section">
        <label>Capacity</label>
        <input
          type="number"
          className="capacity-input"
          placeholder="Enter capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        {errors || error ? <p className="error-text">{errors || error}</p> : null}
      </section>

      <div className="button-container">
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save-button" onClick={handleSave} disabled={Deliveryloading}>
          {Deliveryloading ? <span className="loader"></span> : "Save"}
        </button>
      </div>
    </div>
  );
};

export default RiderCapacity;