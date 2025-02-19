import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listDriverDisapproved } from "@redux/Actions/driverActions";
import { getToken } from "@utils/helpers";
import Sidebar from "../sidebar";
import "@assets/css/driverlist.css";

const DriverNotApproved = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadError, setLoadError] = useState(null);
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [selectedTab, setSelectedTab] = useState("Not_Approved");

  useEffect(() => {
    const fetchDrivers = async () => {
      const token = getToken();

      if (!token) {
        setLoadError("No JWT token found. Please log in again.");
        console.error("JWT token not found in localStorage.");
        return;
      }

      console.log("Token being passed to the API:", token); // Added console log for token

      try {
        dispatch(listDriverDisapproved(token));
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setLoadError("Failed to fetch drivers. Please try again later.");
      }
    };

    fetchDrivers();
  }, [dispatch]);

  return (
    <div className="rider-container">
      <Sidebar />
      {/* <h1 className="header-title">Driver List</h1> */}
      <div className="tabContainer">
        <button
          className={`tabButton ${
            selectedTab === "Not_Approved" ? "activeTab" : ""
          }`}
          onClick={() => {
            navigate("/driverNot");
            setSelectedTab("Not_Approved");
          }}
        >
          Not Approved
        </button>
        <button
          className={`tabButton ${
            selectedTab === "Approved" ? "activeTab" : ""
          }`}
          onClick={() => {
            navigate("/driverlist");
            setSelectedTab("Approved");
          }}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : drivers?.length === 0 || error ? (
        <div className="emptyContainer">
          <p className="emptyText">No Driver found.</p>
        </div>
      ) : (
        <div className="listContainer">
          {drivers.details.map((item) => (
            <div key={item?._id} className="userItem">
              <img
                src={item?.image?.url || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profileImage"
              />
              <div className="userDetails">
                <p className="userName">{`${item?.firstName} ${item?.lastName}`}</p>
                <p className="userEmail">{item?.email}</p>
              </div>
              <button
                className="viewButton"
                onClick={() =>
                  navigate(`/driver-details/${item._id}`, {
                    state: { driver: item },
                  })
                }
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverNotApproved;
