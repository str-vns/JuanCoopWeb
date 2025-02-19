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
    dispatch(rejectMember(memId,token));
    alert("Member rejected successfully");
    setIsLoading(false);
    navigate("/memberlist");
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="driverCardContainer">
      <Sidebar />

      <div className="driverCard">
        <div className="driverCardHeader">
          <img
            src={members?.userId?.image?.url  || "https://via.placeholder.com/150"}
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

      {/* Separate Card for License */}
      <div className="licenseCard">
        <h3 className="driverCardRequirement">Barangay Clearance</h3>
        <div className="licenseCardFiles">
          <img
            src={
                members?.barangayClearance?.url ||
              "https://via.placeholder.com/150"
            }
            className="licenseCardImage"
            alt="Driver License"
            onClick={handleModalOpen}
          />
        </div>
      </div>
      <div className="licenseCard">
        <h3 className="driverCardRequirement">Valid ID</h3>
        <div className="licenseCardFiles">
          <img
            src={
                members?.validId?.url ||
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

export default MemberDetails;