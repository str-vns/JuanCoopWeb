import React from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaComment,
  FaArchive,
  FaClipboardCheck,
  FaNewspaper,
  FaWpforms,
  FaBoxes,
} from "react-icons/fa";
import "./sidebar.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@redux/actions/authActions";
import Cookies from 'js-cookie';

const Sidebar = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

  const handleLogout = () => {
      navigate("/home");
  
      dispatch(logoutUser());
      localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('isAuth');
          localStorage.removeItem('cartItems');
          Cookies.remove('jwt');
      window.location.reload();
    };
  return (
    <div className="sidebar always-visible">
      {/* Sidebar Content */}
      <div className="sidebar-content">
        {/* Add Logo */}
        <img
          src="../../../public/images/logo.png" // Update with your logo's path
          alt="JuanCoop Logo"
          className="sidebar-logo"
        />
        <h2 className="sidebar-title">JuanCoop</h2>
        <ul className="sidebar-menu">
          <li>
            <a href="/coopdashboard" className="sidebar-link">
              <FaTachometerAlt className="sidebar-icon" /> Dashboard
            </a>
          </li>
          <li>
            <a href="/productlist" className="sidebar-link">
              <FaBoxOpen className="sidebar-icon" /> Products
            </a>
          </li>
          <li>
            <a href="/inventorylist" className="sidebar-link">
              <FaBoxes className="sidebar-icon" /> Inventory
            </a>
          </li>
          <li>
            <a href="/cooporderlist" className="sidebar-link">
              <FaClipboardCheck className="sidebar-icon" /> Orders
            </a>
          </li>
          <li>
            <a href="/messenger" className="sidebar-link">
              <FaComment className="sidebar-icon" /> Messages
            </a>
          </li>
          <li>
            <a href="/productarchive" className="sidebar-link">
              <FaArchive className="sidebar-icon" /> Product Archive
            </a>
          </li>
          <li>
            <a href="/bloglist" className="sidebar-link">
              <FaNewspaper className="sidebar-icon" /> News
            </a>
          </li>
          <li>
            <a href="/forumlist" className="sidebar-link">
              <FaWpforms className="sidebar-icon" /> Community Forum
            </a>
          </li>
          <li>
            <a href="#" onClick={handleLogout} className="sidebar-link">
              <i className="fa-solid fa-right-from-bracket sidebar-icon"></i>{" "}
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;