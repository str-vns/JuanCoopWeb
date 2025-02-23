import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { memberInactive } from "@redux/Actions/memberActions";
import Sidebar from "../sidebar";
import { getToken, getCurrentUser } from "@utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@assets/css/driverlist.css";

const MemberNotApprove = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, members = [], error } = useSelector((state) => state.memberList);
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
    <div className="memberContainer">
      <Sidebar />
      <div className="memberTabContainer">
        <button
          className={`memberTabButton ${selectedTab === "Not_Approved" ? "memberActiveTab" : ""}`}
          onClick={() => setSelectedTab("Not_Approved")}
        >
          Not Approved
        </button>
        <button
          className={`memberTabButton ${selectedTab === "Approved" ? "memberActiveTab" : ""}`}
          onClick={() => navigate("/memberlist")}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <div className="memberLoader">Loading...</div>
      ) : error ? (
        <div className="memberErrorContainer">
          <p className="memberErrorText">Error loading members: {error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="memberEmptyContainer">
          <p className="memberEmptyText">No Member found.</p>
        </div>
      ) : (
        <div className="memberListContainer">
          {members.map((item) => (
            <div key={item?._id} className="memberUserItem">
              <img
                src={item?.userId?.image?.url || "https://via.placeholder.com/150"}
                alt="Profile"
                className="memberProfileImage"
              />
              <div className="memberUserDetails">
                <p className="memberUserName">{`${item?.userId?.firstName || "Unknown"} ${item?.userId?.lastName || "Member"}`}</p>
                <p className="memberUserEmail">{item?.userId?.email || "No Email Provided"}</p>
              </div>
              <button
                className="memberViewButton"
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
