import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { Profileuser, ProfileEdit } from "@redux/Actions/userActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useSocket } from "../../../../SocketIo";
import { toast } from "react-toastify";
import "@assets/css/coopEditProfile.css";
import Sidebar from "../sidebar";

const CoopEditProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("/default-profile.png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const { user } = useSelector((state) => state.userOnly);

  const currentUser = getCurrentUser();
  const storedToken = getToken();
  const userId = currentUser?._id;

  const fetchUserData = useCallback(async () => {
    if (storedToken && userId) {
      await dispatch(Profileuser(userId, storedToken));
      setLoading(false);
    } else {
      setError("Failed to fetch user data. Please try again.");
      setLoading(false);
    }
  }, [dispatch, userId, storedToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNum || "",
        gender: user.gender || "",
        image: null,
      });
      setImagePreview(user.image?.url || "/default-profile.png");
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("profileUpdated", () => fetchUserData());
      return () => socket.off("profileUpdated");
    }
  }, [socket, fetchUserData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, image: file }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");
    if (!userData.firstName || !userData.lastName || !userData.phoneNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    if (userData.phoneNumber.length !== 11) {
      setError("Phone number must be 11 digits.");
      return;
    }
    try {
      await dispatch(ProfileEdit(userId, storedToken, userData));
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/CoopProfile"), 2000);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="containerprofile">
      <Sidebar />
      <div className="profilePicContainer">
        <img src={imagePreview} alt="Profile" className="profilePic" />
        <label className="fileInputLabel">
          <input type="file" accept="image/*" onChange={handleFileChange} className="fileInput" />
          <i className="fa-solid fa-image"></i> Choose Profile Picture
        </label>
      </div>
      <div className="inputContainer">
        <label className="label">Edit First Name</label>
        <input type="text" name="firstName" className="input" value={userData.firstName} onChange={handleChange} />

        <label className="label">Edit Last Name</label>
        <input type="text" name="lastName" className="input" value={userData.lastName} onChange={handleChange} />

        <label className="label">Edit Phone Number</label>
        <input type="text" name="phoneNumber" className="input" value={userData.phoneNumber} onChange={handleChange} />

        <label className="label">Edit Gender</label>
        <select name="gender" className="input" value={userData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="prefer not to say">Prefer Not To Say</option>
        </select>

        {error && <div className="error">{error}</div>}
        <button className="button" onClick={handleSave}>Save & Update</button>
      </div>
    </div>
  );
};

export default CoopEditProfile;