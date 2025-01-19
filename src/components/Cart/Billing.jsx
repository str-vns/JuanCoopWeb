import React from "react";
import "../../assets/css/bill.css"; // Ensure the correct CSS path

const Bill = () => {
  return (
    <div className="container two-column-layout">
      {/* Billing Details Section */}
      <div className="billing-details">
        <h2>Billing Details</h2>
        <form>
          <div className="form-row">
            <div className="form-group">
              <label className="register-form-label">First Name:</label>
              <input
                className="register-form-input"
                type="text"
                placeholder="Enter First Name"
              />
            </div>
            <div className="form-group">
              <label className="register-form-label">Last Name:</label>
              <input
                className="register-form-input"
                type="text"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="register-form-label">Address:</label>
              <input
                className="register-form-input"
                type="text"
                placeholder="Enter Address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="register-form-label">City:</label>
              <input
                className="register-form-input"
                type="text"
                placeholder="Enter City"
              />
            </div>
            <div className="form-group">
              <label className="register-form-label">Postal Code:</label>
              <input
                className="register-form-input"
                type="text"
                placeholder="Enter Postal Code"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="register-form-label">Mobile Number:</label>
              <input
                className="register-form-input"
                type="text"
                placeholder="Enter Mobile Number"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Order Summary Section */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <form className="payment-options">
          <label>
            <input type="radio" name="payment" value="online" /> Online Payment
          </label>
          <p className="payment-info">
            Make your payment directly into our bank account. Please use your
            Order ID as the payment reference. Your order will not be shipped
            until the funds have cleared in our account.
          </p>
          <label>
            <input type="radio" name="payment" value="cod" /> Cash On Delivery
          </label>
          <p className="privacy-info">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our <a href="/">privacy policy</a>.
          </p>
          <button type="button" className="bill-button">Place order</button>
        </form>
      </div>
    </div>
  );
};

export default Bill;
