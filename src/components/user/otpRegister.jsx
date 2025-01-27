import React, { useEffect, useState } from "react";
import "@assets/css/otpRegister.css";
import Navbar from "../layout/navbar";
import { OTPregister, registeruser } from "@redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "@redux/Actions/authActions";

function OtpRegister() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, error, loading, user  } = useSelector(state => state.register);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(420); 
  const [canResend, setCanResend] = useState(true);
  const [isResending, setIsResending] = useState(false); 
  const values = location.state.values;

const handleChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); 
    setOtp(newOtp);

    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    if (error){
        alert("Wrong OTP entered. Please try again!");
        return;
    } 
  }, [error])

  const handleSubmit = () => {
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
        alert("Please enter a 6-digit OTP");
        return;
    } else {
        const registerData = {
            otp: otpValue,
            ...values,
        }  
        dispatch(registeruser(registerData));
    }

  };

  useEffect(() => 
    {
       if(isAuthenticated ){
        navigate('/')
       }
  }
)
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on timer change
    } else {
      setCanResend(true);  
    }
  }, [timer]);

  const handleResendOtp = () => {
    if (canResend && !isResending) {
      setIsResending(true);
      dispatch(OTPregister({ email: values.email })); 
      setTimer(420);  
      setCanResend(false); 
      setTimeout(() => {
        setIsResending(false); 
      }, 2000); 
    }
  };

  return (
    <div>
        <Navbar />
 
    <div className="otp-container ">
      <h2>Enter OTP</h2>
      <p>Please enter the 6-digit OTP sent to your mobile</p>
      <div className="otp-input-container">
      {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
      </div>
      
      <button onClick={handleSubmit} className="otp-submit-btn">
        Submit OTP
      </button>
      <div className="resend-otp-container">
          <p>
            {canResend
              ? "You can now resend the OTP."
              : `Resend OTP in ${Math.floor(timer / 60)}:${("0" + (timer % 60)).slice(-2)}`}
          </p>
          <button
            onClick={handleResendOtp}
            className="resend-otp-btn"
            disabled={!canResend || isResending}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
    </div>
    </div>
  );
}

export default OtpRegister;