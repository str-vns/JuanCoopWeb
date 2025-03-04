import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createDriver, clearErrors } from "@redux/Actions/driverActions";
import { OTPregister } from "@redux/Actions/userActions";
import { getCurrentUser, getToken } from "@utils/helpers";
import Sidebar from "../sidebar";


const RiderOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { loading, success, error } = useSelector((state) => state.driverApi);
  const [errors, setErrors] = useState("");
  const [timer, setTimer] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const token = getToken();
  const location = useLocation();
  const registration = location.state?.riderRegister;

console.log("Received registration data:", registration);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const Resend = () => {
    setIsDisabled(true);
    setTimer(7 * 60);
    dispatch(OTPregister({ email: registration.email }));
  };

  useEffect(() => {
    let interval;
    if (isDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      setIsDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isDisabled, timer]);

  const handleVerify = async () => {
    const otpString = otp.join("");
    const registerInfo = { otp: otpString, ...registration };

    if (otpString.length < 6) {
      setErrors("Please fill the OTP");
    } else {
      const result = await dispatch(createDriver(registerInfo, token));
      if (!result) {
        setErrors("Wrong OTP entered. Please try again!");
        setTimeout(() => {
          dispatch(clearErrors());
          setErrors("");
        }, 5000);
      } else {
        alert("Driver created successfully! Please wait for admin approval.");
        dispatch(clearErrors());
        navigate("/riderlist");
      }
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <Sidebar/>
      <h2 className="text-xl font-bold">Phone verification</h2>
      <p className="text-gray-600 mb-4">Enter your OTP code</p>
      <div className="flex gap-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            className="w-10 h-10 border border-gray-300 text-center"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyPress(index, e)}
            type="text"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </div>
      <div className="mb-4">
        <p className="text-gray-600">Didn’t receive code?</p>
        <button 
          className="text-yellow-500 font-bold" 
          onClick={Resend} 
          disabled={isDisabled}>
          {isDisabled ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}` : "Resend again"}
        </button>
      </div>
      {errors && <p className="text-red-500">{errors}</p>}
      <button 
        className="bg-yellow-500 text-white px-4 py-2 rounded" 
        onClick={handleVerify}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default RiderOTP;