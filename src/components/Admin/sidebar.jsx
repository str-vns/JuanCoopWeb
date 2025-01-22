import React from "react";
import "../../assets/css/adminSidebar.css";
import logo from "../../assets/img/logo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@redux/actions/authActions";
import Cookies from "js-cookie";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/home");

    dispatch(logoutUser());
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("cartItems");
    Cookies.remove("jwt");
    window.location.reload();
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <a href="/" className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </a>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/dashboard">
                <i className="fas fa-chart-line sidebar-icon"></i>
                <span className="sidebar-text">Dashboard</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/userlist">
                <i className="fas fa-user-circle sidebar-icon"></i>
                <span className="sidebar-text">User</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/messages">
                <i className="fas fa-building sidebar-icon"></i>
                <span className="sidebar-text">Cooperative</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/messages">
                <i className="fas fa-car sidebar-icon"></i>
                <span className="sidebar-text">Driver</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/bloglists">
                <i className="fas fa-newspaper sidebar-icon"></i>
                <span className="sidebar-text">News</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/track-order">
                <i className="fas fa-pen-to-square sidebar-icon"></i>
                <span className="sidebar-text">Community</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/categorylist">
                <i className="fas fa-list sidebar-icon"></i>
                <span className="sidebar-text">Categories</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/typelist">
                <i className="fas fa-layer-group sidebar-icon"></i>
                <span className="sidebar-text">Types</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Fixed Yellow Button */}
      <div className="sidebar-footer">
        <a href="/" onClick={handleLogout} className="sidebar-button">
          <i className="fas fa-sign-out-alt sidebar-icon"></i>
          <span className="sidebar-text">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
