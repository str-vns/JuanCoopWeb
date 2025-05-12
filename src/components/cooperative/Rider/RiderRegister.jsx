import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister } from "@redux/Actions/userActions";
import axios from "axios";
import baseURL from "@Commons/baseUrl";
import Sidebar from "../sidebar";
import "@assets/css/riderregister.css";
import { getCurrentUser } from "@utils/helpers";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons

const RiderRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [phoneNum, setPhoneNum] = useState("09");
  const [gender, setGender] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [licenseImagePreview, setLicenseImagePreview] = useState(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  // Handle image selection & preview
  const handleImageChange = (e, setImage, setImagePreview) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    setImage(file); // Store the actual File object

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle input clearing & form reset
  const handleCancel = () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setGender("");
    setPhoneNum("09");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setProfileImage(null);
    setLicenseImage(null);
    navigate(-1);
  };

  // Validate user input before submitting
  const validateInputs = async () => {
    if (!firstName || !lastName || !age || !phoneNum || !gender || !email || !password || !profileImage || !licenseImage) {
      return "All fields are required.";
    }
    if (parseInt(age, 10) < 18 || parseInt(age, 10) > 100) {
      return "Age must be between 18 and 100.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Invalid email format.";
    }
    if (!/^09\d{9}$/.test(phoneNum)) {
      return "Phone number must start with '09' and be 11 digits long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    try {
      const { data } = await axios.post(`${baseURL}check-email`, { email });
      if (data.exists) {
        return "Email already exists.";
      }
    } catch (error) {
      console.error("Email validation failed:", error);
      return "Unable to check email availability. Please try again.";
    }

    return null;
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const errorMsg = await validateInputs();
    if (errorMsg) {
      setErrors(errorMsg);
      setLoading(false);
      return;
    }

    dispatch(OTPregister({ email })); // No need for await
    console.log("OTP request dispatched"); // Debugging

    navigate("/riderotp", {
      state: {
        riderRegister: {
          firstName,
          lastName,
          age,
          phoneNum,
          gender,
          email,
          password,
          profileImage,
          licenseImage,
          user: userId,
        },
      },
    });

    setLoading(false);
  };

  return (
    <div className="rider-register">
    <Sidebar />
      <h2 className="rider-register-header">Register</h2>
      {errors && <p style={{ color: "red" }}>{errors}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          maxLength={11}
          placeholder="Phone Number"
          value={phoneNum}
          onChange={(e) => {
            const input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            if (input.startsWith("09") && input.length <= 11) {
              setPhoneNum(input);
            }
          }}
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer not to say">Prefer Not To Say</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"} // Toggle input type based on state
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: "30px" }} // Add padding to avoid overlap with the icon
          />
          <span
            onClick={() => setShowPassword(!showPassword)} // Toggle visibility on click
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: "#888",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type={showConfirmPassword ? "text" : "password"} // Toggle input type for confirm password
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ paddingRight: "30px" }} // Add padding to avoid overlap with the icon
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility on click
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: "#888",
            }}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Upload Profile Image:</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setProfileImage, setProfileImagePreview)} />
        {profileImagePreview && <img src={profileImagePreview} alt="Profile Preview" width="100" />}

        <label>Upload License Image:</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setLicenseImage, setLicenseImagePreview)} />
        {licenseImagePreview && <img src={licenseImagePreview} alt="License Preview" width="100" />}

        <div className="button-row">
          <button
            type="submit"
            className="registerbtn"
            disabled={loading}
            style={{
              backgroundColor: "green", // Green background for the register button
              color: "white", // White text
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={handleCancel}
            style={{
              backgroundColor: "blue", // Blue background for the back button
              color: "white", // White text
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiderRegister;