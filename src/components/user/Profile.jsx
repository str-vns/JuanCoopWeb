import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import { matchCooperative } from "@redux/Actions/coopActions";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import "@assets/css/profile.css";

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

  const handleUpdateProfile = () => {
    navigate("/editprofile");
  };

  return (
    <div className="usercontainer">
      <Navbar />
      {loading ? (
        <p>Loading...</p>
      ) : error || loadError ? (
        <p className="errorText">Error: {error || loadError}</p>
      ) : (
        <>
          <div className="profileSection">
            {user?.image?.url ? (
              <img src={user.image.url} alt="Profile" className="profileImage" />
            ) : (
              <img src="/default-profile.jpg" alt="Default Profile" className="profileImage" />
            )}
            <p className="emailText">{user?.email || "Email not available"}</p>
          </div>
          <input type="text" placeholder="First name" className="input" value={user?.firstName || ""} readOnly />
          <input type="text" placeholder="Last name" className="input" value={user?.lastName || ""} readOnly />
          <input type="text" placeholder="Age" className="input" value={user?.age || ""} readOnly />
          <input type="text" placeholder="Phone number" className="input" value={user?.phoneNum || ""} readOnly />
          <input type="text" placeholder="Gender" className="input" value={user?.gender || ""} readOnly />
        </>
      )}

      {/* Update Profile Button */}
      <button className="update-btn" onClick={handleUpdateProfile}>
        Update Profile
      </button>

      {/* Trapping Logic for Cooperative or User Registration */}
      {userCoops.length > 0 ? (
        // If the user is registered as a cooperative, show "Edit Farm"
        <button className="edit-farm-btn" onClick={() => navigate("/editfarm")}>
          Edit Farm
        </button>
      ) : (
       
        <div className="coop-options">
          <a href="/farmregistration" className="coop-link">
            Register your Cooperative
          </a>
          <br></br>
          <a href="/memberRegistration" className="coop-link">
            Join an Existing Cooperative
          </a>
        </div>
      )}
    </div>
  );
};

export default Profile;
