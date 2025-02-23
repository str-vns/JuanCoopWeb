import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // react-router for web navigation
import { activeCooperative, deleteCooperative } from "@redux/Actions/coopActions"; // Your action imports
import { Spinner } from "react-bootstrap"; // Use Spinner from react-bootstrap
import Sidebar from "../sidebar";
import "@assets/css/coopdetail.css";


const CoopDetails = () => {
  const { coopId } = useParams(); // Get the coopId from URL parameters
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [coopData, setCoopData] = useState(location.state?.coopData || null); // State for coop data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch JWT token from localStorage
  useEffect(() => {
    const fetchJwt = () => {
      const res = localStorage.getItem("jwt");
      setToken(res);
    };

    fetchJwt();
  }, []);

  // Fetch Coop details when the component mounts if coopData is not already provided
  useEffect(() => {
    const fetchCoopDetails = async () => {
      try {
        const response = await fetch(`/api/coops/${coopId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCoopData(data);
        } else {
          console.error("Error fetching coop data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching coop details:", error);
      }
    };

    if (!coopData && coopId && token) {
      fetchCoopDetails();
    }
  }, [coopId, token, coopData]);

  // Handle approve coop
  const handleApprove = async (coopId, userId) => {
    setIsLoading(true);
    try {
      await dispatch(activeCooperative(coopId, userId, token));
      navigate("/cooplist");
    } catch (err) {
      console.error("Error approving cooperative:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete coop
  const handleDelete = async (coopId) => {
    setIsLoading(true);
    try {
      await dispatch(deleteCooperative(coopId, token));
      navigate("/cooplist");
    } catch (err) {
      console.error("Error deleting cooperative:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open file in a new tab
  const handleFileOpen = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("The file is not available.");
    }
  };

  // If coop data is not loaded yet, show loading spinner
  if (!coopData) {
    return (
      <div className="loaderContainer">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="coopDetailsContainer">
        <Sidebar />
  
      <div className="coopContainer">
        <img
          src={coopData?.image?.[0]?.url || "https://via.placeholder.com/150"}
          alt={coopData?.farmName}
          className="coopImage"
        />
        <div className="coopDetails">
          <h2 className="coopName">{coopData?.user?.firstName} {coopData?.user?.lastName}</h2>
          <p className="farmName">Farm Name: {coopData?.farmName}</p>
          <p className="coopEmail">Email: {coopData?.user?.email}</p>
          <p className="address">Address: {coopData?.address}</p>
          <p className="address">Barangay: {coopData?.barangay}</p>
          <p className="address">City: {coopData?.city}</p>
          <p className="address">Tin Number: {coopData?.requirements?.tinNumber}</p>
          <p className={`status ${coopData?.approvedAt === null ? "notApproved" : "approved"}`}>
            Approval Status: {coopData?.approvedAt === null ? "Not Approved" : "Approved"}
          </p>
        </div>
      </div>

      <div className="fileSection">
  <div className="fileContainer">
    <p className="fileLabel">Business Permit:</p>
    {coopData?.requirements?.businessPermit?.url ? (
      <button
        className="fileButton"
        onClick={() => handleFileOpen(coopData?.requirements?.businessPermit?.url)}
      >
        Download to view
      </button>
    ) : (
      <p className="fileStatus">Not provided</p>
    )}
  </div>

  <div className="fileContainer">
    <p className="fileLabel">Cor CDA:</p>
    {coopData?.requirements?.corCDA?.url ? (
      <button
        className="fileButton"
        onClick={() => handleFileOpen(coopData?.requirements?.corCDA?.url)}
      >
        Download to view
      </button>
    ) : (
      <p className="fileStatus">Not provided</p>
    )}
  </div>

  <div className="fileContainer">
    <p className="fileLabel">Organize Structure:</p>
    {coopData?.requirements?.orgStructure?.url ? (
      <button
        className="fileButton"
        onClick={() => handleFileOpen(coopData?.requirements?.orgStructure?.url)}
      >
        Download to view
      </button>
    ) : (
      <p className="fileStatus">Not provided</p>
    )}
  </div>
</div>


      {coopData?.approvedAt === null && (
        <div className="actionButtons">
          <button
            className="approveButton"
            onClick={() => handleApprove(coopData?._id, coopData?.user?._id)}
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Approve"}
          </button>

          <button
            className="declineButton"
            onClick={() => handleDelete(coopData?._id)}
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Decline"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CoopDetails;
