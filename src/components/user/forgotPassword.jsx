import React, { useState } from "react";
import "../../assets/css/forgotpassword.css";
import Password from "../../assets/img/forgot.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`A reset link has been sent to ${email}`);
  };

  return (
    <div className="forgot-password-wrapper"> {/* New wrapper div */}
      <div className="forgot-password-container">
        <img src={Password} alt="Login" />
        <h2>Forgot Password</h2>
        <p>Enter your email address to receive a password reset link.</p>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter your Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">
            Send Reset Link
          </button>
        </form>

        {message && <p className="confirmation-message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
