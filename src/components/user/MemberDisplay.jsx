import React, { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { memberDetails } from "@redux/Actions/memberActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import "@assets/css/memberdisplay.css"; // External CSS

const MemberList = () => {
  const context = useContext(AuthGlobal);
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const token = getToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, members, error } = useSelector((state) => state.memberList);

  useEffect(() => {
    if (userId && token) {
      console.log("Fetching member details for userId:", userId);
      dispatch(memberDetails(userId, token));
    }
  }, [dispatch, userId, token]);

  return (
    <div className="member-container">
      <Navbar />
      {/* <div className="header">
        <h2>Member List</h2>
        <button className="join-button" onClick={() => navigate('/memberRegistration')}>
          Join Member
        </button>
      </div> */}

      <div className="members-list-header">
        <h1 className="members-title">Member List</h1>
        <button
          className="btn-add-product"
          onClick={() => navigate("/memberRegistration")}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error.message}</p>}

      {members?.length > 0 ? (
        <div className="member-list">
          {members.map((member) => (
            <div key={member._id} className="member-card">
              {member?.coopId?.image?.[0]?.url && (
                <img
                  src={member?.coopId?.image?.[0]?.url}
                  alt="Coop"
                  className="member-image"
                />
              )}
              <div className="member-details">
                <h3>
                  <strong>Name: </strong> {member?.coopId?.farmName}
                </h3>
                <p>
                  <strong>Address: </strong> {member?.coopId?.address},{" "}
                  {member?.coopId?.barangay}, {member?.coopId?.city}
                </p>
                <p>
                  <strong>Phone: </strong> {member?.coopId?.user?.phoneNum}
                </p>
                <p>
                  <strong>Status: </strong>{" "}
                  <span
                    className={
                      member?.approvedAt ? "status-member" : "status-pending"
                    }
                  >
                    {member?.approvedAt ? "Member" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No members found.</p>
      )}
    </div>
  );
};

export default MemberList;
