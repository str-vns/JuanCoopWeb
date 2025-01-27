import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Row, Col, Spinner, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { inactiveCooperative } from "@redux/Actions/coopActions";
import "@assets/css/cooplist.css";
import Sidebar from "../sidebar";

const CoopNotApproved = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coops, error } = useSelector((state) => state.allofCoops);
  const [selectedTab, setSelectedTab] = useState("Not_Approved");
  const [token, setToken] = useState(null);

  // Fetch JWT from localStorage
  useEffect(() => {
    const fetchJwt = () => {
      const res = localStorage.getItem("jwt");
      setToken(res);
    };
    fetchJwt();
  }, []);

  // Dispatch inactiveCooperative action
  useEffect(() => {
    if (token) {
      dispatch(inactiveCooperative(token));
    }
  }, [dispatch, token]);

  // Refresh coops list
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(inactiveCooperative(token));
    } catch (err) {
      console.error("Error refreshing coops:", err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, token]);

 return (
    <div className="containerCoop">
      <Sidebar />
      

      <div className="tabContainer">
  <button
    className={`tabButton ${selectedTab === "Not_Approved" ? "activeTab" : ""}`}
    onClick={() => {
      setSelectedTab("Not_Approved"); // Update state for styling purposes
      navigate("/coopNot"); // Navigate to the "Not Approved" route
    }}
  >
    Not Approved
  </button>
  <button
    className={`tabButton ${selectedTab === "Approved" ? "activeTab" : ""}`}
    onClick={() => {
      setSelectedTab("Approved"); // Update state for styling purposes
      navigate("/cooplist"); // Navigate to the "Approved" route
    }}
  >
    Approved
  </button>
</div>

      {loading ? (
        <Spinner animation="border" variant="primary" className="loader" />
      ) : coops?.length === 0 || error ? (
        <div className="emptyContainer">
          <p className="emptyText">No cooperative found.</p>
        </div>
      ) : (
        <div className="listContainer">
          {coops.map((item) => (
            <div key={item?._id} className="userItem">
              <img
                src={item?.image[0]?.url || "https://via.placeholder.com/150"}
                alt={item?.farmName}
                className="profileImage"
              />
              <div className="userDetails">
                <p className="userName">{item?.farmName}</p>
                <p className="userEmail">{item?.user?.email}</p>
                <p className="userRole">Address: {item?.address}</p>
              </div>
              <button
                onClick={() => navigate(`/coop-details/${item?._id}`, { state: { coopData: item } })}
                className="viewButton"
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

export default CoopNotApproved;
