import React from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from 'html2canvas-pro';

const QrPage = () => {
  const location = useLocation();
  const { order, trackId, userId } = location.state || {};

  console.log("Order Data in QrPage:", order); // Debugging output
  console.log("Track ID in QrPage:", trackId); // Debugging output
  console.log("User ID in QrPage:", userId); // Debugging output

  const generateQRCodeData = () => {
    const qrData = JSON.stringify({
      orderId: order?._id || "UNKNOWN_ORDER",
      deliveryId: trackId || "MISSING_DELIVERY_ID",
      userId: userId || "UNKNOWN_USER",
      status: "delivered",
    });

    console.log("Generated QR Code Data:", qrData); // Debugging output
    return qrData;
  };

  const downloadQRCode = () => {
    const qrElement = document.getElementById("qr-code");
    if (qrElement) {
      html2canvas(qrElement, {
        scale: 2,
        useCORS: true, // Enable cross-origin resource sharing
        backgroundColor: "#ffffff", // Explicitly set a supported background color
      })
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `qr-code-${order?._id || "UNKNOWN_ORDER"}.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error generating QR code image:", error);
          alert("Failed to download QR code. Please try again.");
        });
    } else {
      alert("QR code element not found.");
    }
  };

  return (
    <div style={styles.qrPage}>
      <h2 style={styles.qrTitle}>Scan QR code</h2>
      <p style={styles.qrSubtitle}>Scan this QR code in-app to verify a device.</p>

      <div
        id="qr-code"
        style={{
          backgroundColor: "#ffffff",
          padding: "15px",
          border: "2px solid #ddd",
          borderRadius: "10px",
          display: "inline-block",
          color: "#000", // Just in case
        }}
      >
        <QRCodeCanvas value={generateQRCodeData()} size={256} />
      </div>

      <div style={styles.qrManual}>
        <p>Orderlist Number</p>
        <div style={styles.qrCodeInput}>
          <input
            type="text"
            value={order?._id || "UNKNOWN_ORDER"}
            readOnly
            style={styles.input}
          />
        </div>
      </div>

      <button onClick={downloadQRCode} style={styles.qrDownloadButton}>
        Download
      </button>
    </div>
  );
};

const styles = {
  qrPage: {
    textAlign: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  qrTitle: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  qrSubtitle: {
    fontSize: "16px",
    color: "#555",
  },
  qrContainer: {
    margin: "20px auto",
    padding: "15px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    display: "inline-block",
  },
  qrManual: {
    marginTop: "10px",
  },
  qrCodeInput: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    width: "200px",
    padding: "8px",
    textAlign: "center",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  qrDownloadButton: {
    marginTop: "20px",
    backgroundColor: "#008f4f",
    color: "white",
    padding: "10px 20px",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default QrPage;