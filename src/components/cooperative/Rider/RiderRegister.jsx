import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister, checkEmail } from "@redux/Actions/userActions";
import axios from "axios";
import baseURL from "@Commons/baseUrl";
import Sidebar from "../sidebar";
import { getCurrentUser, getToken } from "@utils/helpers";
import "@assets/css/riderregister.css";

const RiderRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const token = getToken();
  const { isEmailAvailable } = useSelector((state) => state.checkDuplication);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [phoneNum, setPhoneNum] = useState("09");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [driversLicenseImage, setDriversLicenseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [checked, setChecked] = useState(false);

  // Handle Image Upload
  const handleImageUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // Directly store the file object
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Register button clicked!");

    try {
        console.log("Checking email existence...");
        const { data } = await axios.post(`${baseURL}check-email`, { email });
        const response = await axios.post(`${baseURL}check-driver-email`, { email });

        if (!firstName || !lastName || !age || !phoneNum || !email || !password || !image || !driversLicenseImage || !gender) {
            console.log("Validation failed: Missing required fields");
            setErrors("All fields are required.");
        } else if (!checked) {
            console.log("Validation failed: Terms not accepted");
            setErrors("Please accept the terms and conditions.");
        } else if (data.details || response.data.details) {
            console.log("Validation failed: Email already exists");
            setErrors("Email already exists.");
        } else if (age < 18) {
            console.log("Validation failed: Age too low");
            setErrors("You must be at least 18 years old.");
        } else if (age > 164) {
            console.log("Validation failed: Invalid age");
            setErrors("Invalid age.");
        } else if (phoneNum.length < 11) {
            console.log("Validation failed: Invalid phone number");
            setErrors("Invalid phone number.");
        } else if (password !== confirmPassword) {
            console.log("Validation failed: Password mismatch");
            setErrors("Passwords do not match.");
        } else if (password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            console.log("Validation failed: Weak password");
            setErrors("Password must be at least 8 characters, include a letter, number, and special character.");
        } else {
            console.log("All validation passed. Dispatching OTP...");
            dispatch(OTPregister({ email }));

            const riderRegister = {
                firstName,
                lastName,
                age,
                phoneNum,
                gender,
                image,
                driversLicenseImage,
                email,
                password,
                userId,  
              }

            console.log("Navigating to RiderOTP with data:", riderRegister);
            navigate("/riderotp", { state: { riderRegister } });
        }
    } catch (error) {
        console.log("Error occurred:", error);
        setErrors("An error occurred.");
    }

    setLoading(false);
}

const handleChangeText = (e) => {
    const text = e.target.value; // Extract the value from event
    if (text.startsWith("09")) {
        setPhoneNum(text);
    } else {
        setPhoneNum("09");
    }
};


  return (
    <div className="rider-register-container">
      <Sidebar />
      <h2>Register</h2>
      {errors && <p className="error-text">{errors}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNum}
            onChange={handleChangeText} // ✅ Keep this
            maxLength={11}
            required
            />

        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Image Uploads */}
        <label>Profile Picture</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setImage)} />
        {image && <img src={URL.createObjectURL(image)} alt="Profile Preview" className="preview-image" />}

        <label>Driver's License</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setDriversLicenseImage)} />
        {driversLicenseImage && (
          <img src={URL.createObjectURL(driversLicenseImage)} alt="License Preview" className="preview-image" />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label>
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />{" "}
          Accept Terms and Conditions
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RiderRegister;