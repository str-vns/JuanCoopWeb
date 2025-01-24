import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listDriver } from "@redux/Actions/driverActions";
import "../../../assets/css/driverlist.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sidebar from "@components/Admin/sidebar";

const DriverList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, drivers, error } = useSelector((state) => state.driverList);
  const [selectedTab, setSelectedTab] = useState("Approved");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };

    fetchJwt();
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(listDriver(token));
    }
  }, [dispatch, token]);

  return (
    <div className="container">
      <Sidebar />
      {/* <h1 className="header-title">Driver List</h1> */}
      <div className="tabContainer">
        <button
          className={`tabButton ${selectedTab === "Not_Approved" ? "activeTab" : ""}`}
          onClick={() => navigate("/driverNot")}
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
                onClick={() => navigate(`/driver-details/${item._id}`, { state: { driver: item } })}
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

export default DriverList;
