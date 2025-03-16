import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { removeLocation } from "@redux/Actions/driverActions";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "@assets/css/riderdetails.css";
import Sidebar from "../sidebar";
import Modal from "react-modal";

Modal.setAppElement("#root");
const RiderDetails = () => {
  const location = useLocation();
  const driver = location.state?.driver;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
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
      <div className="rider-details-header">
        <h1>Rider Details</h1>
      </div>
      <div className="rider-details-coopContainer">
        <img
          src={driver?.image?.url || "https://via.placeholder.com/150"}
          className="rider-details-coopImage"
          alt="Driver"
        />
        <div className="rider-details-coopDetails">
          <div className="rider-info">
            {/* Rider Details */}
            <div className="rider-text">
              <h3>
                {driver?.firstName} {driver?.lastName}
              </h3>
              <p>
                <b>Email:</b> {driver?.email}
              </p>
              <p>
                <b>Gender:</b> {driver?.gender}
              </p>
              <p>
                <b>Phone Number:</b> {driver?.phoneNum}
              </p>
              <p>
                <b>Driver License:</b>
                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={openModal}
                >
                  Click to view
                </span>
              </p>
            </div>

            {/* Status and License */}
            <div className="rider-status">
              <p
                className={
                  driver?.approvedAt === null
                    ? "rider-details-notApproved"
                    : "rider-details-approved"
                }
              >
                Approval Status:{" "}
                {driver?.approvedAt === null ? "Not Approved" : "Approved"}
              </p>
              <p
                className={
                  driver?.isAvailable === "false"
                    ? "rider-details-notApproved"
                    : "rider-details-approved"
                }
              >
                Availability Status:{" "}
                {driver?.isAvailable === "false" ? "Unavailable" : "Available"}
              </p>
            </div>
          </div>
        </div>

        {/* Modal for License Image */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Driver License"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "300px", // Adjust the width as needed
              height: "auto", // Adjust the height as needed
              padding: "20px",
              overflow: "auto",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          }}
        >
          <img
            src={
              driver?.driversLicenseImage?.url ||
              "https://via.placeholder.com/150"
            }
            alt="Driver License"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Modal>
      </div>

      <div className="rider-details-row">
        <h3>
          Max Capacity: {driver?.maxCapacity || 0}
          <button
            className="rider-details-button"
            onClick={() => maxCoopCapacity(driver._id)}
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </h3>
        <h3>
          Assigned Location
          <button
            className="rider-details-button"
            onClick={() => assignLocation(driver._id)}
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </h3>

        {/* Assigned Location List */}
        {driver?.assignedLocation?.length > 0 ? (
          <div className="rider-details-locationList">
            {isExpanded &&
              driver.assignedLocation.map((assigned) => (
                <div key={assigned._id} className="rider-details-productCard">
                  <p>Barangay: {assigned?.barangay}</p>
                  <p>City: {assigned?.city}</p>
                  <button
                    className="rider-btn-delete"
                    onClick={() => handleRemoveLocation({locationId: assigned._id})}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            <button
              className="rider-details-toggleButton"
              onClick={() => toggleExpandedOrder(driver._id)}
            >
              {isExpanded ? "Show Less" : "Show All"}
            </button>
          </div>
        ) : (
          <p>No locations assigned</p>
        )}
      </div>
    </div>
  );
};

export default RiderDetails;
