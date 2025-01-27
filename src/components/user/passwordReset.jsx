import React, { useState } from "react";
import "@assets/css/forgotpassword.css";
import Password from "@assets/img/forgot.png";
import { resetPassword } from "@redux/Actions/userActions";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const token = useParams().id;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordLength = /^(?=.{8,})/;
    const passwordLowercase = /^(?=.*[a-z])/;
    const passwordUppercase = /^(?=.*[A-Z])/;
    const passwordNumber = /^(?=.*\d)/;
    const passwordSpecial = /^(?=.*\W)/;

    if (!passwordLength.test(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    } else if (!passwordLowercase.test(password)) {
      setError("Password must contain at least 1 lowercase letter.");
      return;
    } else if (!passwordUppercase.test(password)) {
      setError("Password must contain at least 1 uppercase letter.");
      return;
    } else if (!passwordNumber.test(password)) {
      setError("Password must contain at least 1 number.");
      return;
    } else if (!passwordSpecial.test(password)) {
      setError("Password must contain at least 1 special character.");
      return;
    }

    // Create a payload with both password and confirmPassword
    const payload = {
      newPassword: password,
      confirmPassword: confirmPassword,
    };

    dispatch(resetPassword(payload, token));
    navigate("/login");
    setError("");
  };

  return (
    <div className="forgot-password-wrapper text-black">
      <div className="forgot-password-container">
        <img src={Password} alt="Login" />
        <h2>Forgot Password</h2>
        <p>Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password-button"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
