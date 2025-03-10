import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createDriver } from "@redux/Actions/driverActions";
import { OTPregister } from "@redux/Actions/userActions";
import Sidebar from "../sidebar";
import { getToken } from "@utils/helpers";

const RiderOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getToken();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { loading, success, error } = useSelector((state) => state.driverApi);
  const [errors, setErrors] = useState("");
  const [timer, setTimer] = useState(420);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const location = useLocation();
  const riderRegister = location.state?.riderRegister;

  console.log("🚀 Received registration data:", riderRegister);

  useEffect(() => {
    if (!riderRegister) {
      alert("No registration data found. Redirecting...");
      navigate("/riderlist");
    }
  }, [riderRegister, navigate]);

  useEffect(() => {
    if (riderRegister?.email) {
      console.log("📩 Rider email for OTP:", riderRegister.email);
    }
  }, [riderRegister]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      console.log("🔢 Current OTP input:", newOtp.join("")); // Log full OTP input

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    if (error) {
      alert("❌ Wrong OTP entered. Please try again!");
      console.log("⚠️ OTP error:", error);
    }
  }, [error]);

  const handleSubmit = () => {
    const otpValue = otp.join("");

    console.log("✅ Final OTP entered by user:", otpValue);
    console.log("📌 Stored OTP from API response:", riderRegister?.otp);

    if (otpValue.length < 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }

    if (!riderRegister) {
      alert("❌ Missing registration data. Please register again.");
      navigate("/register");
      return;
    }

    const registerData = {
      otp: otpValue,
      ...riderRegister,
    };

    console.log("📤 Submitting registration data:", registerData);
    dispatch(createDriver(registerData, token));
    navigate("/riderlist");
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    if (canResend && !isResending) {
      if (!riderRegister?.email) {
        alert("⚠️ Email is missing. Please register again.");
        return;
      }

      setIsResending(true);
      console.log("🔄 Resending OTP to:", riderRegister.email);

      try {
        const res = await dispatch(OTPregister({ email: riderRegister.email }));
        console.log("📩 New OTP response:", res);
      } catch (err) {
        console.error("❌ Error resending OTP:", err);
      }

      setTimer(420);
      setCanResend(false);

      setTimeout(() => {
        setIsResending(false);
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <Sidebar />
      <h2 className="text-xl font-bold">Phone Verification</h2>
      <p className="text-gray-600 mb-4">Enter your OTP code</p>
      <div className="flex gap-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={digit}
            maxLength="1"
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            className="w-10 h-10 border border-gray-300 text-center"
            autoFocus={index === 0}
          />
        ))}
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          {canResend
            ? "You can now resend the OTP."
            : `Resend OTP in ${Math.floor(timer / 60)}:${("0" + (timer % 60)).slice(-2)}`}
        </p>
        <button
          className="text-yellow-500 font-bold"
          onClick={handleResendOtp}
          disabled={!canResend || isResending}
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
      {errors && <p className="text-red-500">{errors}</p>}
      <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default RiderOTP;