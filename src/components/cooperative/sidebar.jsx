import React, { useEffect, useState } from "react";
import "@assets/css/adminSidebar.css";
import logo from "@assets/img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@redux/Actions/authActions";
import Cookies from "js-cookie";
import { getCurrentUser, getToken, isAuth } from "@utils/helpers";
import {
  singleNotification,
  readAllNotifications,
  readNotification,
} from "@redux/Actions/notificationActions";
import { useSocket } from "../../../SocketIo";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = getCurrentUser();
  const socket = useSocket();
  const token = getToken();
  const { notification } = useSelector((state) => state.getNotif);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?._id) {
        dispatch(singleNotification(user._id, token));
      }
    };
    fetchNotifications();
  }, [user?._id, dispatch]);

  useEffect(() => {
    setNotifCount(notification.filter((notif) => notif.readAt === null).length);
  }, [notification]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        const unreadCount = notification.filter((notif) => notif.readAt === null).length;
        setNotifCount(unreadCount + 1);
      });
      return () => {
        socket.off("getNotification");
      };
    }
  }, [socket, notification]);

  const handleReadAll = async () => {
    dispatch(readAllNotifications(user?._id, token));
    setNotifCount(0);
  };

  const handleLogout = () => {
    navigate("/");

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
              <a className="sidebar-link" href="/coopdashboard">
                <i className="fas fa-chart-line sidebar-icon"></i>
                <span className="sidebar-text">Dashboard</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/CoopProfile">
                <i className="fas fa-user-circle sidebar-icon"></i>
                <span className="sidebar-text">Profile</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/productlist">
                <i className="fas fa-solid fa-bag-shopping sidebar-icon"></i>
                <span className="sidebar-text">Products</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/productarchive">
                <i className="fas fa-solid fa-bag-shopping sidebar-icon"></i>
                <span className="sidebar-text">Product Archive</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/inventorylist">
                <i className="fas fa-solid fa-note-sticky sidebar-icon"></i>
                <span className="sidebar-text">Inventory</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/cooporderlist">
                <i className="fas fa-user-circle sidebar-icon"></i>
                <span className="sidebar-text">Orders</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/messenger">
                <i className="fas fa-solid fa-comments sidebar-icon"></i>
                <span className="sidebar-text">Messages</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/notificationlist">
                <i className="fas fa-solid fa-bell sidebar-icon"></i>
                <span className="sidebar-text">Notifications {notifCount > 0 && <span className="coop-notif-badge">{notifCount}</span>}</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/riderlist">
                <i className="fas fa-solid fa-truck sidebar-icon"></i>
                <span className="sidebar-text">Rider</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/withdrawlist">
                <i className="fa-solid fa-wallet sidebar-icon"></i>
                <span className="sidebar-text">Wallet</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/memberlist">
                <i className="fas fa-solid fa-person sidebar-icon"></i>
                <span className="sidebar-text">Members</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/reviewratinglist">
                <i className="fas fa-solid fa-star sidebar-icon"></i>
                <span className="sidebar-text">Rating</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/bloglistcoop">
                <i className="fas fa-newspaper sidebar-icon"></i>
                <span className="sidebar-text">Blogs</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a className="sidebar-link" href="/forumlistcoop">
                <i className="fas fa-pen-to-square sidebar-icon"></i>
                <span className="sidebar-text">Discussion</span>
              </a>
            </li>
          
            {/* <li className="sidebar-item">
              <a className="sidebar-link" href="/notificationlistp">
                <i className="fas fa-solid fa-bell sidebar-icon"></i>
                <span className="sidebar-text">Notification</span>
              </a>
            </li> */}
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
