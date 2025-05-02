import React from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const QrPage = () => {
  const location = useLocation();
  const { order, trackId, userId } = location.state || {};

  const generateQRCodeData = () => {
    return JSON.stringify({
      orderId: order?._id || "UNKNOWN_ORDER",
      deliveryId: trackId || "MISSING_DELIVERY_ID",
      userId: userId || "UNKNOWN_USER",
      status: "delivered",
    });
  };

  return (
    <div style={styles.qrPage}>
      <h2 style={styles.qrTitle}>Scan QR code</h2>
      <p style={styles.qrSubtitle}>
        Scan this QR code in-app to verify a device.
      </p>

      <div
        id="qr-code"
        style={{
          backgroundColor: "#ffffff",
          padding: "15px",
          border: "2px solid #ddd",
          borderRadius: "10px",
          display: "inline-block",
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

      <p style={styles.snipNote}>
        To save this QR code, press <strong>Windows + Shift + S</strong> to take a screenshot.
      </p>
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
  snipNote: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "5px",
    display: "inline-block",
  },
};

export default QrPage;
