import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { memberInactive } from "@redux/Actions/memberActions";
import "@assets/css/driverlist.css";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemberNotApprove = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, members = [], error } = useSelector((state) => state.memberList); // Ensure members is an empty array by default
  const [selectedTab, setSelectedTab] = useState("Not_Approved");
  const [token, setToken] = useState(null);
  const currentUser = getCurrentUser();
    const userId = currentUser?._id;

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
      dispatch(memberInactive(userId, token));
    }
  }, [dispatch, userId, token]);

  return (
    <div className="container">
      <Sidebar />
      <div className="tabContainer">
        <button
          className={`tabButton ${selectedTab === "Not_Approved" ? "activeTab" : ""}`}
          onClick={() => setSelectedTab("Not_Approved")}
        >
          Not_Approved
        </button>
        <button
          className={`tabButton ${selectedTab === "Approved" ? "activeTab" : ""}`}
          onClick={() => navigate("/memberlist")}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : error ? (
        <div className="errorContainer">
          <p className="errorText">Error loading members: {error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="emptyContainer">
          <p className="emptyText">No Member found.</p>
        </div>
      ) : (
        <div className="listContainer">
          {members.map((item) => (
            <div key={item?._id} className="userItem">
              <img
                src={item?.userId?.image?.url || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profileImage"
              />
              <div className="userDetails">
                <p className="userName">{`${item?.userId?.firstName || "Unknown"} ${item?.userId?.lastName || "Member"}`}</p>
                <p className="userEmail">{item?.userId?.email || "No Email Provided"}</p>
              </div>
              <button
                className="viewButton"
                onClick={() => navigate(`/member-details/${item._id}`, { state: { member: item } })}
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

export default MemberNotApprove;
