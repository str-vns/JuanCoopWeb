import React from "react";
import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const QrPage = () => {
  const location = useLocation();
  const { order } = location.state || {};

  const generateQRCodeData = () => {
    return JSON.stringify({
      orderId: order._id,
      status: "delivered",
      userId: order.userId,
    });
  };

  const downloadQRCode = () => {
    const qrElement = document.getElementById("qr-code");
    if (qrElement) {
      html2canvas(qrElement).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `qr-code-${order._id}.png`;
        link.click();
      });
    }
  };

  return (
    <div style={styles.qrPage}>
      <h2 style={styles.qrTitle}>Scan QR code</h2>
      <p style={styles.qrSubtitle}>Scan this QR code in-app to verify a device.</p>

      <div id="qr-code" style={styles.qrContainer}>
        <QRCodeCanvas value={generateQRCodeData()} size={256} />
      </div>

      <div style={styles.qrManual}>
        <p>Orderlist Number</p>
        <div style={styles.qrCodeInput}>
          <input type="text" value={order?._id} readOnly style={styles.input} />
        
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
  copyButton: {
    cursor: "pointer",
    border: "none",
    background: "none",
    fontSize: "18px",
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
  qrDownloadButtonHover: {
    backgroundColor: "#00703e",
  },
};

export default QrPage;
