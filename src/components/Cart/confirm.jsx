import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import check from "@assets/img/check.png"; // Import the check image
import Navbar from "../layout/navbar";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from '@redux/Actions/cartActions';
import { clearShip } from '@redux/Actions/shippingActions';
import { clearPay } from '@redux/Actions/paymentActions';
import { jsPDF } from "jspdf"; // Import jsPDF

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

  const handleDownloadReceipt = () => {
  try {
    setLoading(true);

    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US');
    const timeStr = now.toLocaleTimeString('en-US');
    const receiptNumber = `#RCPT-${now.getTime()}`;

    const totalPrice = cartItems.reduce((total, item) => total + item.pricing * item.quantity, 0);
    const tax = (totalPrice * 0.12).toFixed(2); // 12% VAT
    const grandTotal = (totalPrice + parseFloat(tax)).toFixed(2);

    let y = 20;

    // Header - Store Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const logoBase64 = "data:image/png;base64,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"; // full string here
    doc.addImage(logoBase64, 'PNG', 20, 10, 20, 20);
    doc.text("JUANKOOP", 50, 20); // Shifted right so it doesn't overlap with logo


    y += 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`ORDER SUMMARY`, 20, y);
    doc.text(`Date: ${dateStr} ${timeStr}`, 190, y, { align: "right" });

    y += 10;

    // Table Headers
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Image", 20, y);
    doc.text("Item", 40, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 130, y);
    doc.text("Subtotal", 170, y);

    doc.setFont("helvetica", "normal");
    y += 6;

    // Items
for (const item of cartItems) {
  const subtotal = (item.pricing * item.quantity).toFixed(2);

  // Optional: Load image from URL to Base64 (if not already base64)
  // For local images or URLs, you'll need to convert to base64 before using addImage
  // You can skip this if `item.image` is already a base64 string like "data:image/png;base64,..."

  // Display image (resize to thumbnail)
  if (item.image) {
    // Assumes item.image is a base64 string
    try {
      doc.addImage(item.image, 'JPEG', 20, y, 15, 15); // x, y, width, height
    } catch (err) {
      console.warn("Failed to load image for item:", item.productName);
    }
  }

  // Display text info (with offset to avoid overlapping image)
  const textY = y + 5; // adjust vertical alignment
  doc.text(`${item.productName || "N/A"}`, 40, textY);
  doc.text(`${item.quantity || 0}`, 100, textY);
  doc.text(`${item.pricing.toFixed(2)}`, 130, textY);
  doc.text(`${subtotal}`, 170, textY);

  y += 20; // Add more vertical space due to image height
}

    // Divider
    y += 4;

    // Totals
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal:`, 130, y);
    doc.text(`${totalPrice.toFixed(2)}`, 170, y);
    y += 6;
    doc.text(`Tax (12%):`, 130, y);
    doc.text(`${tax}`, 170, y);
    y += 6;
    doc.text(`Total:`, 130, y);
    doc.text(`${grandTotal}`, 170, y);

    // Shipping Info
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Shipping to:", 20, y);
    y += 6;
    doc.text(`${shipItems?.fullName || "N/A"}`, 20, y);
    y += 6;
    doc.text(`${shipItems?.address || "N/A"}, ${shipItems?.city || "N/A"}`, 20, y);
    y += 6;
    doc.text(`Postal Code: ${shipItems?.postalCode || "N/A"}`, 20, y);

    // Payment Method
    y += 10;
    doc.text(`Payment Method: ${payItems.paymentMethod || "N/A"}`, 20, y);

    // Footer
    y += 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", 105, y, { align: "center" });

    doc.save("order_summary.pdf");
    alert("Receipt generated successfully!");
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
      <h2 style={styles.heading}>Order Confirmation</h2>
      <p style={styles.subText}>Thank you for your order! Your receipt is ready.</p>

      {/* Receipt Button */}
      <button style={styles.receiptButton} onClick={handleDownloadReceipt} disabled={loading}>
        {loading ? "Generating..." : "Download Order Summary"}
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
    padding: "20px",
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
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  checkImage: {
    color: "#4CAF50",
    width: "80px",
    height: "80px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    marginTop: "20px",
  },
  subText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
  },
  receiptButton: {
    backgroundColor: "#FFFA8D",
    color: "black",
    border: "none",
    borderRadius: "30px",
    padding: "12px 30px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "10px",
    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  receiptButtonHover: {
    backgroundColor: "#FCF259",
  },
  backToHome: {
    color: "#F3C623",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default OrderConfirmation;
