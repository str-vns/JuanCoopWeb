import React, { useState, useEffect } from "react";
import "@assets/css/register.css";
import registerImage from "@assets/img/login.png"; // Adjust path as per your folder structure
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Navbar from "../layout/navbar";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { OTPregister, checkEmail } from "@redux/Actions/userActions";
import { toast } from "react-toastify";
import axios from "axios";
import image from "@assets/img/default_avatar.jpg"
import baseURL from '@Commons/baseUrl'; 

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { isEmailAvailable, loading } = useSelector((state) => state.checkDuplication)
  const [avatarPreview, setAvatarPreview] = useState(image);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
 
  const handleSubmit = async (values, isEmailAvailable) => {
    
    console.log(isEmailAvailable)
    if (isEmailAvailable === true) {
      toast.error("Email already exists, try another email", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: 'emailExists',
        closeButton: false,
      });
      return; 
    } 
     if (!termsAndConditions) {
      toast.error("Please read and accept the terms and conditions", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: 'termsConditions',
        closeButton: false,
      });
      return; 
    }

    if (isEmailAvailable === false && termsAndConditions) {
      const data = {
        fname: values.fname,
        lname: values.lname,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        password: values.password,
        age: values.age,
        avatar: avatar,
      };
  
      dispatch(OTPregister({ email: values.email }));
      localStorage.setItem("UserRegister", JSON.stringify(data));
      navigate("/otp", { state: { values: values } });
    } else {
      alert("Unexpected error"); // Catch any unexpected logic issues
    }

  };

const validationSchema = Yup.object({
  fname: Yup.string().required("First Name is required"),
  lname: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
    phone: Yup.string()
    .matches(/^09\d{9}$/, "Phone number must start with '09' and be 11 digits long")
    .required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must have at least 8 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number"),
  passwordConfirm: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  avatar: Yup.mixed().required("Profile is required")
    .test("fileType", "Only image files are allowed", (value) => value && value.type.startsWith("image/")),
  age: Yup.number()
  .required("Age is required")
  .positive("Age must be a positive number")
  .integer("Age must be an integer")
  .min(18, "Age must be greater than 18")
  .max(164, "Age must be less than 164"),
});

const formik = useFormik({
  initialValues: {
    fname: "",
    lname: "",
    email: "",
    phone: "09",
    gender: "",
    password: "",
    passwordConfirm: "",
    age: "",
    avatar: null,
  },
  validationSchema,
  onSubmit: async  (values) => {
    try {
      const { data } = await axios.post(`${baseURL}check-email`, {email: values.email});
      handleSubmit(values, data.details);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  },
  
});



const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    setAvatar(e.target.files[0]);
    reader.readAsDataURL(file);
    formik.setFieldValue("avatar", file);
  } else {
    toast.error("Please select a valid image file.", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: "invalidImage",
      closeButton: false,
    });
  }
};

const handleCheckboxChange = () => {
  setTermsAndConditions(!termsAndConditions);
};

return (
  <>
    <Navbar />
    <div className="register-signup-container mt-14">
      <div className="imageR-section">
        <img src={registerImage} alt="Farmer" />
      </div>
      <div className="register-signup-card">
        <h1 className="register-form-title">Sign up</h1>
        <p className="register-form-description">
          Let’s get you all set up so you can access your personal account.
        </p>
        <form onSubmit={formik.handleSubmit} className="register-form">
          <div className="register-form-row">
            <div className="register-form-group">
              <label>First Name</label>
              <input
                type="text"
                name="fname"
                value={formik.values.fname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Input First Name"
                className="register-form-input"
              />
              {formik.touched.fname && formik.errors.fname && (
                <span className="text-red-500 text-sm ml-3">
                  {formik.errors.fname}
                </span>
              )}
            </div>
            <div className="register-form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lname"
                value={formik.values.lname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Input Last Name"
                className="register-form-input"
              />
              {formik.touched.lname && formik.errors.lname && (
                <span className="text-red-500 text-sm ml-3">
                  {formik.errors.lname}
                </span>
              )}
            </div>
          </div>

          <div className="register-form-row">
            <div className="register-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Input Email"
                className="register-form-input"
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 text-sm ml-3">
                  {formik.errors.email}
                </span>
              )}
            </div>
            <div className="register-form-group">
    <label>Phone Number</label>
    <input
      type="tel"
      name="phone"
      value={formik.values.phone}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="Input Phone Number"
      className="register-form-input"
    />
    {formik.touched.phone && formik.errors.phone && (
      <span className="text-red-500 text-sm ml-3">
        {formik.errors.phone}
      </span>
    )}
  </div>
          </div>

          <div className="register-form-row">
            <div className="register-form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="register-form-input"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer not to say">Prefer not to say</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <span className="text-red-500 text-sm ml-3">
                  {formik.errors.gender}
                </span>
              )}
            </div>

            <div>
              <label>Age</label>
              <input
                type="age"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Input Age"
                className="register-form-input"
              />
              {formik.touched.age && formik.errors.age && (
                <span className="text-red-500 text-sm ml-3">
                  {formik.errors.age}
                </span>
              )}
            </div>

            <div className="register-form-group">
              <label>Profile Picture</label>
              <div className="d-flex flex-wrap items-center my-2">
                <div className="pr-3">
                  <figure className="avatar w-20 h-20">
                    <img
                      src={avatarPreview}
                      className="rounded-circle w-16 h-16 object-cover"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file relative">
                  <input
                    type="file"
                    name="avatar"
                    className="hidden"
                    id="customFile"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <label
                    htmlFor="customFile"
                    className="px-4 py-2 border-2 border-black rounded-md cursor-pointer bg-white text-black hover:bg-black hover:text-white"
                  >
                    Choose Avatar
                  </label>
                </div>
              </div>
              {formik.touched.avatar && formik.errors.avatar && (
                <span className="text-red-500 text-sm ml-3">
                  {formik.errors.avatar}
                </span>
              )}
            </div>

           
            
          </div>

          <div className="register-form-row">
  <div className="register-form-group relative">
    <label>Password</label>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formik.values.password}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="Enter Password"
      className="register-form-input pr-10"
    />
    <span
      onClick={toggleShowPassword}
      className="absolute right-3 top-9 cursor-pointer"
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </span>
    {formik.touched.password && formik.errors.password && (
      <span className="text-red-500 text-sm ml-3">
        {formik.errors.password}
      </span>
    )}
            </div>
            <div className="register-form-group relative">
  <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
  <div className="relative">
    <input
      type= {showConfirmPassword ? "text" : "password"}
      name="passwordConfirm"
      value={formik.values.passwordConfirm}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder="Confirm Password"
      className="register-form-input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
    <span
      onClick={toggleShowConfirmPassword}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
    >
      {showConfirmPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white hover:text-teal-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-teal-600 hover:text-teal-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </span>
  </div>
  {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
    <span className="text-red-500 text-sm mt-1">
      {formik.errors.passwordConfirm}
    </span>
  )}
</div>
          </div>
          <div>
        <label  className="text-black">
          <input
            type="checkbox"
            checked={termsAndConditions}
            onChange={handleCheckboxChange}
          />
          I accept the{" "}
          <a
            href="https://www.example.com/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            Terms & Conditions
          </a>
        </label>
      </div>
          <button type="submit" className="register-submit-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  </>
);
}


export default Register;
