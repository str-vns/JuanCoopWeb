import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../sidebar";
import { approveMember, rejectMember, memberRemove } from "@redux/Actions/memberActions";
import "@assets/css/driverdetails.css";

const MemberDetails = () => {
  const location = useLocation();
  const members = location.state?.member;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

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

  const handleApprove = (memId, userId) => {
    setIsLoading(true);
    dispatch(approveMember(memId, userId, token));
    alert("Member approved successfully");
    setIsLoading(false);
    navigate("/memberlist");
  };

  const handleDelete = (memId) => {
    setIsLoading(true);
    dispatch(rejectMember(memId, token));
    alert("Member rejected successfully");
    setIsLoading(false);
    navigate("/memberlist");
  };

  const handleModalOpen = (imageUrl) => {
    setModalImage(imageUrl);
    setZoomLevel(1); // Reset zoom level when opening a new image
    setPanPosition({ x: 0, y: 0 }); // Reset pan position
    setIsModalOpen(true);
  };

  const handleModalClose = (e) => {
    if (e.target.classList.contains("licenseModal")) {
      setIsModalOpen(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3)); // Limit zoom to 3x
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1)); // Limit zoom to 1x
  };

  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanPosition({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="driverCardContainer">
      <Sidebar />

      <div className="driverCard">
        <div className="driverCardHeader">
          <img
            src={members?.userId?.image?.url || "https://via.placeholder.com/150"}
            className="driverCardImage"
            alt="Driver"
          />
          <div className="driverCardDetails">
            <h1 className="driverCardTitle">
              {members?.userId?.firstName} {members?.userId?.lastName}
            </h1>
            <p>Email: {members?.userId?.email}</p>
            <p>Address: {members?.address} </p>
            <p>Barangay: {members?.barangay}</p>
            <p>City: {members?.city}</p>

            <p
              className={`driverCardStatus ${
                members?.approvedAt === null ? "notApproved" : "approved"
              }`}
            >
              Approval Status:{" "}
              {members?.approvedAt === null ? "Not Approved" : "Approved"}
            </p>
          </div>
        </div>

        {members?.approvedAt === null && (
          <div className="driverCardButtonContainer">
            <button
              className="driverCardButton"
              onClick={() => handleApprove(members?._id, members?.userId?._id)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Approve"}
            </button>
            <button
              className="driverCardButton"
              onClick={() => handleDelete(members?._id)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Decline"}
            </button>
          </div>
        )}
      </div>

      {/* Separate Card for Barangay Clearance */}
      <div className="licenseCard">
        <h3 className="driverCardRequirement">Barangay Clearance</h3>
        <div className="licenseCardFiles">
          <img
            src={members?.barangayClearance?.url || "https://via.placeholder.com/150"}
            className="licenseCardImage"
            alt="Barangay Clearance"
            onClick={() => handleModalOpen(members?.barangayClearance?.url)}
          />
        </div>
      </div>

      {/* Separate Card for Valid ID */}
      <div className="licenseCard">
        <h3 className="driverCardRequirement">Valid ID</h3>
        <div className="licenseCardFiles">
          <img
            src={members?.validId?.url || "https://via.placeholder.com/150"}
            className="licenseCardImage"
            alt="Valid ID"
            onClick={() => handleModalOpen(members?.validId?.url)}
          />
        </div>
      </div>

      {/* Modal for Zooming, Panning, and Downloading Image */}
      {isModalOpen && (
        <div
          className="licenseModal"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleModalClose}
        >
          <div className="licenseModalContent">
            <span className="licenseModalClose" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <img
              src={modalImage}
              className="licenseModalImage"
              alt="Zoomed Image"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                transition: isPanning ? "none" : "transform 0.3s ease",
                cursor: isPanning ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
            />
            <div className="licenseModalControls">
              <button className="licenseModalButton" onClick={handleZoomIn}>
                Zoom In
              </button>
              <button className="licenseModalButton" onClick={handleZoomOut}>
                Zoom Out
              </button>
              <button className="licenseModalButton" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;