import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Privacy Policy</h1>
      <p style={styles.date}>Effective Date: May 13, 2025</p>
      <p><strong>Platform Name:</strong> JuanKooP</p>
      <p><strong>Website:</strong> <a href="https://juancoopweb.onrender.com/" target="_blank" rel="noopener noreferrer">https://juancoopweb.onrender.com/</a></p>
      <p><strong>Entity Type:</strong> Business</p>
      <p><strong>Jurisdiction:</strong> Philippines</p>

      <h2 style={styles.subheader}>1. Introduction</h2>
      <p>
        JuanKooP (“we,” “our,” “us”) values your privacy and is committed to protecting the personal
        information you provide to us. This Privacy Policy explains how we collect, use, disclose,
        and safeguard your information when you use our website or mobile application (the “Platform”).
      </p>
      <p>
        By accessing or using JuanKooP, you agree to the terms of this Privacy Policy and consent to
        the collection and processing of your personal data in accordance with Republic Act No. 10173,
        also known as the Data Privacy Act of 2012.
      </p>

      <h2 style={styles.subheader}>2. Information We Collect</h2>
      <p>
        We collect personal and business information necessary to provide our services, verify cooperative
        identity, facilitate transactions, and support platform functionalities.
      </p>
      <p><strong>Personal Information We Collect May Include:</strong></p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Full Name</li>
        <li style={styles.listItem}>Email Address</li>
        <li style={styles.listItem}>Phone Number</li>
        <li style={styles.listItem}>Residential or Business Address</li>
        <li style={styles.listItem}>Age</li>
        <li style={styles.listItem}>Uploaded Images or Profile Photos</li>
        <li style={styles.listItem}>Business Documents and Permits</li>
      </ul>
      <p><strong>Device and Technical Data:</strong></p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Geolocation</li>
        <li style={styles.listItem}>Camera Access</li>
        <li style={styles.listItem}>Photo Gallery Access</li>
        <li style={styles.listItem}>Local Storage and Sessions</li>
      </ul>
      <p>
        We do not use cookies, ad trackers, or analytics software. We also do not send marketing newsletters or promotional messages.
      </p>

      <h2 style={styles.subheader}>3. How We Use Your Information</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>To create and manage user or cooperative accounts</li>
        <li style={styles.listItem}>To verify user identity and cooperative legitimacy</li>
        <li style={styles.listItem}>To process product listings, orders, and online payments</li>
        <li style={styles.listItem}>To enable delivery tracking and geolocation-based services</li>
        <li style={styles.listItem}>To allow access to features such as the forum, reviews, and analytics tools</li>
        <li style={styles.listItem}>To ensure the safety, security, and performance of the platform</li>
      </ul>

      <h2 style={styles.subheader}>4. Online Payments</h2>
      <p>
        Our Platform accepts online payments. All transactions are processed securely through third-party
        payment providers. We do not store or directly access any sensitive financial information such as
        credit or debit card details.
      </p>

      <h2 style={styles.subheader}>5. Data Sharing and Disclosure</h2>
      <p>We do not sell or rent your personal data to third parties.</p>
      <p>We may share your information only when necessary:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>With third-party service providers (e.g., payment gateways, cloud hosting)</li>
        <li style={styles.listItem}>To comply with legal obligations or respond to lawful requests</li>
        <li style={styles.listItem}>With your explicit consent for cooperative visibility or public profiles</li>
      </ul>

      <h2 style={styles.subheader}>6. Social Login</h2>
      <p>
        JuanKooP allows users to log in using Google Login for convenience and account security. No
        additional social media data is collected or shared beyond authentication.
      </p>

      <h2 style={styles.subheader}>7. Children’s Privacy</h2>
      <p>
        Our platform is not intended for children under the age of 13. We do not knowingly collect or
        process personal information from individuals below this age.
      </p>

      <h2 style={styles.subheader}>8. Your Rights Under the Data Privacy Act</h2>
      <p>As a data subject under the Data Privacy Act of 2012, you have the right to:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Access and request a copy of your personal data</li>
        <li style={styles.listItem}>Correct inaccurate or outdated information</li>
        <li style={styles.listItem}>Object to processing under certain conditions</li>
        <li style={styles.listItem}>Request deletion or blocking of data (subject to legal requirements)</li>
        <li style={styles.listItem}>Withdraw consent at any time</li>
        <li style={styles.listItem}>Lodge a complaint with the National Privacy Commission (NPC)</li>
      </ul>
      <p>
        To exercise any of these rights, you may contact us using the details below.
      </p>

      <h2 style={styles.subheader}>9. Data Security and Retention</h2>
      <p>
        We implement administrative, technical, and physical safeguards to protect your personal data
        against unauthorized access, loss, or misuse. Your data is retained only for as long as necessary
        to fulfill the purposes for which it was collected, or as required by law.
      </p>

      <h2 style={styles.subheader}>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically to reflect changes in our operations or legal
        requirements. Updated versions will be posted on this page with a new effective date. Continued
        use of the platform indicates your acceptance of any revisions.
      </p>

      <h2 style={styles.subheader}>11. Contact Us</h2>
      <p>
        If you have any questions, requests, or concerns about this Privacy Policy or our data handling
        practices, you may contact us at:
      </p>
      <p><strong>📧 Email:</strong> agrikaani@gmail.com</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    lineHeight: 1.6,
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    textAlign: "left", // ensures all text defaults to left alignment
  },
  header: {
    textAlign: "left", // changed from "center"
    fontSize: "32px",
    marginBottom: "10px",
    fontWeight: "bold", // Make the title bold
  },
  date: {
    textAlign: "left", // changed from "center"
    fontStyle: "italic",
    color: "#666",
  },
  subheader: {
    marginTop: "20px",
    fontSize: "20px",
    color: "#222",
    textAlign: "left", // explicitly left-aligned
    fontWeight: "bold", // Make the subheaders bold
  },
  list: {
    listStyleType: "disc", // Use bullets for all lists
    marginLeft: "20px", // Add left margin for indentation
  },
  listItem: {
    marginBottom: "5px", // Add spacing between list items
  },
};

export default PrivacyPolicy;