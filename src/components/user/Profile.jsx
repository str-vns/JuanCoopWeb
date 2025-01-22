import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Profileuser } from "@redux/Actions/userActions";
import AuthGlobal from "../../redux/Store/AuthGlobal";
import { getToken, getCurrentUser } from "@utils/helpers";
import { matchCooperative } from "@redux/Actions/coopActions";
// import { memberAllList } from '@redux/Actions/memberActions';
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/navbar";
import "../../assets/css/profile.css";

const Profile = () => {
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();
  const storedToken = getToken(); 
  const userId = currentUser?._id;
  const { coops } = useSelector((state) => state.allofCoops);
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.userOnly);

  console.log(getCurrentUser())
  const [loadError, setLoadError] = useState(null);
  const filterUser = Array.isArray(coops)
  ? coops.filter((coop) => coop?.user?._id === userId)
  : [];

  console.log("filterUser", filterUser); 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
       // Use helper to get the token
    
        if (storedToken) {
          if (userId) {
            dispatch(Profileuser(userId, storedToken)); 
            dispatch(matchCooperative(storedToken));
          } else {
            setLoadError("User ID is missing.");
            console.error("User ID is missing from current user:", currentUser);
          }
        } else {
          setLoadError("No JWT token found.");
          console.error("JWT token not found in localStorage.");
        }
      } catch (error) {
        console.error("Error retrieving JWT:", error);
        setLoadError("Failed to retrieve JWT token.");
      }

      console.log("AuthGlobal context:", context);
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
              <img
                src="/default-profile.jpg"
                alt="Default Profile"
                className="profileImage"
              />
            )}
            <p className="emailText">{user?.email || "Email not available"}</p>
          </div>
          <input
            type="text"
            placeholder="First name"
            className="input"
            value={user?.firstName || ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Last name"
            className="input"
            value={user?.lastName || ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Age"
            className="input"
            value={user?.age || ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Phone number"
            className="input"
            value={user?.phoneNum || ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Gender"
            className="input"
            value={user?.gender || ""}
            readOnly
          />
        </>
      )}
      <button className="update-btn" onClick={handleUpdateProfile}>
        Update Profile
      </button>
      {filterUser.length > 0 ? (
     

null
) :  <div className="coop-link-container">
<a href="/farmregistration" className="coop-link">
  Are you part of a Coop? Register here!
</a>
</div> }
    </div>
  );
};

export default Profile;
