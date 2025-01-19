import React from "react";
import "../../App.css";
import logo from "../../assets/img/logo.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Scrollable Content */}
      <div className="sidebar-content">
        <div className="sidebar-header">
          <a href="/" className="logo">
            <img src={logo} alt="Logo" className="logo-image" />{" "}
            {/* Use the logo */}
          </a>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/">
                <i className="fas fa-home sidebar-icon"></i>
                Home
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/dashboard">
                <i className="fas fa-chart-line sidebar-icon"></i>
                Dashboard
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/profile">
                <i className="fas fa-user-circle sidebar-icon"></i>
                Profile
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/messages">
                <i className="fas fa-comments sidebar-icon"></i>
                Messages
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/notifications">
                <i className="fas fa-bell sidebar-icon"></i>
                Notifications
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/track-order">
                <i className="fas fa-truck sidebar-icon"></i>
                Track Order
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Fixed Yellow Button */}
      <div className="sidebar-footer">
        <a href="/cooplogin" className="sidebar-button">
          <i className="fas fa-sign-out-alt sidebar-icon"></i>
          Logout
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
