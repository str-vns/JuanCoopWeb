import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaComment,
  FaArchive,
  FaClipboardCheck,
  FaNewspaper,
  FaWpforms,
  FaBoxes,
  FaUsers,
  FaShippingFast,
  FaRegStar,
  FaRegBell,
  FaUserEdit
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "@redux/Actions/authActions";
import Cookies from "js-cookie";
import "./sidebar.css";

const Sidebar = () => {
  const location = useLocation(); // Get current path
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    dispatch(logoutUser());
    localStorage.clear();
    Cookies.remove("jwt");
    window.location.reload();
  };

  return (
    <div className="sidebar always-visible">
      <div className="sidebar-content">
        <img
          src="../../../public/images/logo.png"
          alt="JuanCoop Logo"
          className="sidebar-logo"
        />
        <ul className="sidebar-menu">
          {[
            { path: "/coopdashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
            { path: "/profile", label: "Profile", icon: <FaUserEdit /> },
            { path: "/productlist", label: "Products", icon: <FaBoxOpen /> },
            { path: "/inventorylist", label: "Inventory", icon: <FaBoxes /> },
            { path: "/cooporderlist", label: "Orders", icon: <FaClipboardCheck /> },
            { path: "/messenger", label: "Messages", icon: <FaComment /> },
            { path: "/productarchive", label: "Product Archive", icon: <FaArchive /> },
            { path: "/bloglist", label: "News", icon: <FaNewspaper /> },
            { path: "/forumlist", label: "Community Forum", icon: <FaWpforms /> },
            { path: "/memberlist", label: "Members", icon: <FaUsers /> },
            { path: "/riderlist", label: "Riders", icon: <FaShippingFast /> },
            { path: "/reviewratinglist", label: "Review", icon: <FaRegStar /> },
            { path: "/notificationlist", label: "Notifications", icon: <FaRegBell /> },
          ].map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`coop-sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="coop-sidebar-icon">{item.icon}</span>
                <span className="coop-sidebar-label">{item.label}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#" onClick={handleLogout} className="coop-sidebar-link">
              <i className="fa-solid fa-right-from-bracket coop-sidebar-icon"></i>{" "}
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;