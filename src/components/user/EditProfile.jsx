import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthGlobal from "@redux/Store/AuthGlobal";
import { Profileuser, ProfileEdit } from "@redux/Actions/userActions";
import { getToken, getCurrentUser } from "@utils/helpers";
import { useSocket } from "../../../SocketIo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/UserEditProfile.css";
import Navbar from "../layout/navbar";

const EditProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();

  const context = useContext(AuthGlobal);
  const { user } = useSelector((state) => state.userOnly);

  const currentUser = getCurrentUser();
  const storedToken = getToken();
  const userId = currentUser?._id;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (storedToken && userId) {
          dispatch(Profileuser(userId, storedToken));
        } else {
          setErrors("Failed to fetch user data. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors("An unexpected error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, userId, storedToken]);

  // Populate fields with existing user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhoneNumber(user.phoneNum || "");
      setGender(user.gender || "");
      setImagePreview(user.image?.url || "/default-profile.png");
    }
  }, [user]);

  // Listen for profile updates via socket
  useEffect(() => {
    if (socket) {
      socket.on("profileUpdated", (updatedProfile) => {
        console.log("Profile updated via socket:", updatedProfile);
        dispatch(Profileuser(userId, storedToken));
      });

      return () => {
        socket.off("profileUpdated");
      };
    }
  }, [socket, dispatch, userId, storedToken]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors("Only image files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors("File size should not exceed 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setErrors(""); // Reset errors
    setSuccessMessage(""); // Reset success message

    if (!firstName || !lastName || !phoneNumber) {
      setErrors("Please fill in all required fields.");
      return;
    }

    if (phoneNumber.length !== 11) {
      setErrors("Phone number must be 11 digits.");
      return;
    }

    const userData = {
      firstName,
      lastName,
      phoneNumber,
      gender,
      image, // This will be null if no file is selected
    };

    console.log("Saving the following user data:", userData);

    dispatch(ProfileEdit(userId, storedToken, userData))
      .then(() => {
        console.log("Profile updated successfully!");
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => navigate("/profile"), 2000);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setErrors("Failed to update profile. Please try again.");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="containerprofile">
    <Navbar />
      <div className="profilePicContainer">
        <img src={imagePreview} alt="Profile" className="profilePic" />
        <label className="fileInputLabel">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="fileInput" /* Add a class to style the input */
          />
          <i className="fa-solid fa-image"></i> Choose Profile Picture
        </label>
      </div>

      <div className="inputContainer">
        <label className="label">Edit First Name</label>
        <input
          type="text"
          className="input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className="label">Edit Last Name</label>
        <input
          type="text"
          className="input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label className="label">Edit Phone Number</label>
        <input
          type="text"
          className="input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <label className="label">Edit Gender</label>
        <select
          className="input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="prefer not to say">Prefer Not To Say</option>
        </select>

        {errors && <div className="error">{errors}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <button className="button" onClick={handleSave}>
          Save & Update
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
