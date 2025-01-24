import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "@components/Admin/sidebar";
import { driverApproved, driverRejected } from "@redux/Actions/driverActions";
import "../../../assets/css/driverdetails.css";

const DriverDetails = () => {
  const location = useLocation();
  const driver = location.state?.driver;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = localStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  const handleApprove = async (driverId) => {
    setIsLoading(true);

    try {
      dispatch(driverApproved(driverId, token));
      alert("Driver approved successfully");
      navigate("/driver-list");
    } catch (error) {
      alert("Error approving driver");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (driverId) => {
    setIsLoading(true);

    try {
      dispatch(driverRejected(driverId, token));
      alert("Driver rejected successfully");
      navigate("/driver-list");
    } catch (error) {
      alert("Error rejecting driver");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="driverCardContainer">
      <Sidebar />

      <div className="driverCard">
        <div className="driverCardHeader">
          <img
            src={driver?.image?.url || "https://via.placeholder.com/150"}
            className="driverCardImage"
            alt="Driver"
          />
          <div className="driverCardDetails">
            <h1 className="driverCardTitle">
              {driver?.firstName} {driver?.lastName}
            </h1>
            <p>Email: {driver?.email}</p>
            <p>Gender: {driver?.gender}</p>
            <p>Phone Number: {driver?.phoneNum}</p>
            <p>Farm Driver: {driver?.coopId?.farmName}</p>
            <p>
              Farm Address: {driver?.coopId?.address},{" "}
              {driver?.coopId?.barangay}, {driver?.coopId?.city}
            </p>

            <p
              className={`driverCardStatus ${
                driver?.approvedAt === null ? "notApproved" : "approved"
              }`}
            >
              Approval Status:{" "}
              {driver?.approvedAt === null ? "Not Approved" : "Approved"}
            </p>
          </div>
        </div>

        {driver?.approvedAt === null && (
          <div className="driverCardButtonContainer">
            <button
              className="driverCardButton"
              onClick={() => handleApprove(driver?._id)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Approve"}
            </button>
            <button
              className="driverCardButton"
              onClick={() => handleDelete(driver?._id)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Decline"}
            </button>
          </div>
        )}
      </div>

      {/* Separate Card for License */}
      <div className="licenseCard">
        <h3 className="driverCardRequirement">License</h3>
        <div className="licenseCardFiles">
          <img
            src={
              driver?.driversLicenseImage?.url ||
              "https://via.placeholder.com/150"
            }
            className="licenseCardImage"
            alt="Driver License"
            onClick={handleModalOpen}
          />
        </div>
      </div>

      {/* Modal for Zooming License */}
      {isModalOpen && (
        <div className="licenseModal">
          <div className="licenseModalContent">
            <span className="licenseModalClose" onClick={handleModalClose}>
              &times;
            </span>
            <img
              src={
                driver?.driversLicenseImage?.url ||
                "https://via.placeholder.com/150"
              }
              className="licenseModalImage"
              alt="Driver License"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDetails;
