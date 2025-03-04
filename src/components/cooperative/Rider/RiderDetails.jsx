import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { removeLocation } from "@redux/Actions/driverActions";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import "@assets/css/riderdetails.css"; 
import Sidebar from "../sidebar";

const RiderDetails = () => {
  const location = useLocation();
  const driver = location.state?.driver;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const toggleExpandedOrder = (driverId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [driverId]: !prevState[driverId],
    }));
  };

  const assignLocation = (driverId) => {
    navigate("/assignlocation", { state: { driverId } });
  };

  const maxCoopCapacity = (driverId) => {
    navigate("/maxcapacity", { state: { driverId } });
  };

  const handleRemoveLocation = (locationId) => {
    if (window.confirm("Are you sure you want to remove this location?")) {
      dispatch(removeLocation(driver._id, locationId, token));
      navigate("/riderlist");
    }
  };

  const isExpanded = expandedOrders[driver._id];

  return (
    <div className="rider-details-container">
      <Sidebar />
      <header className="rider-details-header">
        <h2>Driver Details</h2>
      </header>

      <div className="rider-details-coopContainer">
        <img
          src={driver?.image?.url || "https://via.placeholder.com/150"}
          className="rider-details-coopImage"
          alt="Driver"
        />
        <div className="rider-details-coopDetails">
          <h3>{driver?.firstName} {driver?.lastName}</h3>
          <p>Email: {driver?.email}</p>
          <p>Gender: {driver?.gender}</p>
          <p>Phone Number: {driver?.phoneNum}</p>
          <p className={driver?.approvedAt === null ? "rider-details-notApproved" : "rider-details-approved"}>
            Approval Status: {driver?.approvedAt === null ? "Not Approved" : "Approved"}
          </p>
          <p className={driver?.isAvailable === "false" ? "rider-details-notApproved" : "rider-details-approved"}>
            Availability Status: {driver?.isAvailable === "false" ? "Unavailable" : "Available"}
          </p>
        </div>
      </div>

      <div className="rider-details-containerFileAll">
        <h3>License</h3>
        <div className="rider-details-imageContainer">
          <Zoom>
            <img
              src={driver?.driversLicenseImage?.url || "https://via.placeholder.com/150"}
              className="rider-licenseImage"
              alt="License"
            />
          </Zoom>
        </div>
      </div>
      <div className="rider-details-row">
  <h3>
    Assigned Location
    <button className="rider-details-button" onClick={() => assignLocation(driver._id)}>➕</button>
  </h3>

  {driver?.assignedLocation?.length > 0 ? (
  <div>
    {isExpanded &&
      driver.assignedLocation.map((assigned) => (
        <div key={assigned._id} className="rider-details-productCard">
          <p>Barangay: {assigned?.barangay}</p>
          <p>City: {assigned?.city}</p>
          <button className="rider-details-deleteButton" onClick={() => handleRemoveLocation(assigned._id)}>🗑️</button>
        </div>
      ))}
    <button className="rider-details-toggleButton" onClick={() => toggleExpandedOrder(driver._id)}>
      {isExpanded ? "Show Less" : "Show All"}
    </button>
  </div>
) : (
  <p>No locations assigned</p>
)}

  <h3>
    Max Capacity: {driver?.maxCapacity || 0}
    <button className="rider-details-button" onClick={() => maxCoopCapacity(driver._id)}>➕</button>
  </h3>
</div>
    </div>
  );
};

export default RiderDetails;