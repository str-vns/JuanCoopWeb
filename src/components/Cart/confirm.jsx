import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import check from "@assets/img/check.png"; // Import the check image
import Navbar from "../layout/navbar";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from '@redux/Actions/cartActions';
import { clearShip } from '@redux/Actions/shippingActions';
import { clearPay } from '@redux/Actions/paymentActions';

import html2pdf from 'html2pdf.js';

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const payItems = useSelector((state) => state.payItems);
  const cartItems = useSelector((state) => state.cartItems);
  const shipItems = useSelector((state) => state.shipItems);
  const [loading, setLoading] = useState(false);

  const handleReceiptClick = () => {
    navigate("/summary", { state: { cartItems, addressData: shipItems, paymentMethod: payItems.paymentMethod } });
  };

  const handleBackToHomeClick = () => {
    dispatch(clearCart());
    dispatch(clearShip());
    dispatch(clearPay());

    navigate("/");
    alert("Navigating back to Home...");
  };

  //   try {
  //     setLoading(true);

  //     // Calculate total price
  //     const totalPrice = cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0).toFixed(2);

  //     // Create HTML content for receipt
  //     const htmlContent = `
  //       <html>
  //         <body>
  //           <h1>Order Receipt</h1>
  //           <p><b>Date:</b> ${new Date().toLocaleDateString('en-US')}</p>
  //           <p><b>Total Price:</b> ₱${totalPrice}</p>
  //           <h3>Items:</h3>
  //           <ul>
  //             ${cartItems
  //               .map(
  //                 (item) =>
  //                   `<li>${item.productName || "N/A"} - Quantity: ${item.quantity || 0} - Price: ₱${item.pricing || "0.00"}</li>`
  //               )
  //               .join("")}
  //           </ul>
  //           <p><b>Shipping Address:</b></p>
  //           <p>${shipItems?.fullName || "N/A"}<br>
  //              ${shipItems?.address || "N/A"}, ${shipItems?.city || "N/A"}<br>
  //              ${shipItems?.postalCode || "N/A"}</p>
  //           <p><b>Payment Method:</b> ${payItems.paymentMethod || "N/A"}</p>
  //         </body>
  //       </html>
  //     `;

  //     // Generate PDF from HTML content
  //     const element = document.createElement('div');
  //     element.innerHTML = htmlContent;
  //     html2pdf().from(element).save('receipt.pdf');

  //     alert('Receipt generated successfully!');
  //   } catch (error) {
  //     alert(`Failed to generate receipt: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDownloadReceipt = () => {
    try {
      setLoading(true);
  
      // Calculate total price
      const totalPrice = cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0).toFixed(2);
  
      // Create HTML content for receipt with CSS
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
              }
              h1 {
                color: #007BFF;
                margin-bottom: 20px;
              }
              p {
                margin: 5px 0;
              }
              ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
              }
              li {
                margin-bottom: 10px;
              }
              .total-price {
                font-weight: bold;
                font-size: 18px;
                color: #28a745;
                margin-top: 20px;
              }
              .shipping-address, .payment-method {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                width: 100%;
                max-width: 400px;
              }
              .receipt-container {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <h1>Order Summary</h1>
              <p><b>Date:</b> ${new Date().toLocaleDateString('en-US')}</p>
              <p class="total-price"><b>Total Price:</b> ₱${totalPrice}</p>
              <h3>Items:</h3>
              <ul>
                ${cartItems
                  .map(
                    (item) =>
                      `<li>${item.productName || "N/A"} - Quantity: ${item.quantity || 0} - Price: ₱${item.pricing || "0.00"}</li>`
                  )
                  .join("")}
              </ul>
              <div class="shipping-address">
                <p><b>Shipping Address:</b></p>
                <p>
                   ${shipItems?.address || "N/A"}, ${shipItems?.city || "N/A"}<br>
                   ${shipItems?.postalCode || "N/A"}</p>
              </div>
              <div class="payment-method">
                <p><b>Payment Method:</b> ${payItems.paymentMethod || "N/A"}</p>
              </div>
            </div>
          </body>
        </html>
      `;
  
      // Generate PDF from HTML content
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      html2pdf().from(element).save('receipt.pdf');
  
      alert('Receipt generated successfully!');
    } catch (error) {
      alert(`Failed to generate receipt: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={styles.container}>
      <Navbar />
      {/* Confirmation Icon */}
      <div style={styles.iconContainer}>
        <div style={styles.circle}>
          <img
            src={check}
            alt="Order Confirmed"
            style={styles.checkImage} // Style for the image
          />
        </div>
      </div>

      {/* Text */}
      <h2 style={styles.heading}>Your Order is Confirmed</h2>
      <p style={styles.subText}>Thank you for your Order</p>

      {/* Receipt Button */}
      <button style={styles.receiptButton} onClick={handleDownloadReceipt} disabled={loading}>
        {loading ? "Generating..." : "Generate Receipt"}
      </button>

      {/* Back to Home */}
      <p style={styles.backToHome} onClick={handleBackToHomeClick}>
        Back to Home
      </p>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  iconContainer: {
    marginBottom: "20px",
  },
  circle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkImage: {
    width: "100px",
    height: "100px",
  },
  heading: {
    fontSize: "24px",
    margin: "10px 0",
    color: "#000",
  },
  subText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  receiptButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  backToHome: {
    color: "#007BFF",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default OrderConfirmation;