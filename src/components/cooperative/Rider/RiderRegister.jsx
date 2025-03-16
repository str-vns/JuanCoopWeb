import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister } from "@redux/Actions/userActions";
import axios from "axios";
import baseURL from "@Commons/baseUrl";
import Sidebar from "../sidebar";
import "@assets/css/riderregister.css";
import { getCurrentUser} from "@utils/helpers";

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
      <Sidebar/>
      <h2>Register</h2>
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label>Upload Profile Image:</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setProfileImage, setProfileImagePreview)} />
        {profileImagePreview && <img src={profileImagePreview} alt="Profile Preview" width="100" />}

        <label>Upload License Image:</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setLicenseImage, setLicenseImagePreview)} />
        {licenseImagePreview && <img src={licenseImagePreview} alt="License Preview" width="100" />}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default RiderRegister;