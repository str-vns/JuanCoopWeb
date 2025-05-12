import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allCoops } from "@redux/Actions/coopActions";
import { Spinner } from "react-bootstrap";
import "@assets/css/cooplist.css";
import Sidebar from "../sidebar";

const Cooplist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const { loading, coops, error } = useSelector((state) => state.allofCoops);
  const [selectedTab, setSelectedTab] = useState("Approved");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchJwt = () => {
      const res = localStorage.getItem("jwt");
      setToken(res);
    };

    fetchJwt();
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(allCoops(token));
    }
  }, [dispatch, token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(allCoops(token));
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
          onClick={() => navigate("/coopNot")}
        >
          Not Approved
        </button>
        <button
          className={`tabButton ${selectedTab === "Approved" ? "activeTab" : ""}`}
          onClick={() => setSelectedTab("Approved")}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <Spinner animation="border" variant="primary" className="loader" />
      ) : error ? (
        <div className="emptyContainer">
          <p className="emptyText">Error loading cooperatives: {error}</p>
        </div>
      ) : !coops || coops.length === 0 ? (
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
                onClick={() =>
                  navigate(`/coop-details/${item?._id}`, { state: { coopData: item } })
                }
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

export default Cooplist;
