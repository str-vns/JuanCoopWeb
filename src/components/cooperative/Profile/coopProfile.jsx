import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import { matchCooperative } from "@redux/Actions/coopActions";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";

import "@assets/css/profileCoop.css";

const Profile = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const storedToken = getToken();
  const userId = currentUser?._id;
  const { coops } = useSelector((state) => state.allofCoops);
  const { loading, user, error } = useSelector((state) => state.userOnly);

  const [loadError, setLoadError] = useState(null);
  
  const userCoops = Array.isArray(coops)
    ? coops.filter((coop) => coop?.user?._id === userId)
    : [];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (storedToken) {
          if (userId) {
            dispatch(Profileuser(userId, storedToken));
            dispatch(matchCooperative(storedToken));
          } else {
            setLoadError("User ID is missing.");
          }
        } else {
          setLoadError("No JWT token found.");
        }
      } catch (error) {
        setLoadError("Failed to retrieve JWT token.");
      }
    };

    fetchUserData();
  }, [userId, dispatch]);

  const handleUpdateProfile = (coopId) => {
    navigate(`/CoopEdit`);
  };
  return (
    <div className="usercontainer">
    <Sidebar />
    <div className="profileWrapper">
      {loading ? (
        <p>Loading...</p>
      ) : error || loadError ? (
        <p className="errorText">Error: {error || loadError}</p>
      ) : (
        <div className="profileContent">
          <div className="leftColumn">
            <div className="profileSection">
              {user?.image?.url ? (
                <img src={user.image.url} alt="Profile" className="profileImage" />
              ) : (
                <img src="/default-profile.jpg" alt="Default Profile" className="profileImage" />
              )}
              <p className="emailText">{user?.email || "Email not available"}</p>
            </div>
          </div>

          <div className="rightColumn">
            <input type="text" placeholder="First name" className="input" value={user?.firstName || ""} readOnly />
            <input type="text" placeholder="Last name" className="input" value={user?.lastName || ""} readOnly />
            <input type="text" placeholder="Age" className="input" value={user?.age || ""} readOnly />
            <input type="text" placeholder="Phone number" className="input" value={user?.phoneNum || ""} readOnly />
            <input type="text" placeholder="Gender" className="input" value={user?.gender || ""} readOnly />
            <button className="update-btn" onClick={handleUpdateProfile}>Update Profile</button>

            {userCoops.length > 0 && (
              <button className="edit-farm-btn" onClick={() => navigate("/editfarm")}>Edit Farm</button>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Profile;
