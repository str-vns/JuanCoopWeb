import React, { useState } from "react";
import "@assets/css/Paymaya.css";
import Navbar from "../layout/navbar";

const PaymayaForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Paymaya payment details submitted successfully!");
  };

  return (
    <div className="paymaya-final"> {/* Corrected Class Name */}

      <Navbar />

      <div className="paymaya-form-container"> {/* Corrected Class Name */}
        <h2 className="paymaya-form-title">Paymaya Payment Form</h2>
        <form onSubmit={handleSubmit} className="paymaya-form">
          <label className="paymaya-label">Full Name:</label>
          <input
            type="text"
            name="name"
            className="paymaya-input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="paymaya-label">Email Address:</label>
          <input
            type="email"
            name="email"
            className="paymaya-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="paymaya-label">Phone Number (Paymaya):</label>
          <input
            type="tel"
            name="phone"
            className="paymaya-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label className="paymaya-label">Amount (₱):</label>
          <input
            type="number"
            name="amount"
            className="paymaya-input"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <button type="submit" className="paymaya-submit-button">
            Submit Payment
          </button>
        </form>
      </div>

    </div>
  );
};

export default PaymayaForm;
