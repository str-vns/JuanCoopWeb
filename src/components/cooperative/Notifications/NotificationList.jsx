import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { singleNotification, readAllNotifications, readNotification } from '@src/redux/Actions/notificationActions';
import { getCurrentUser, getToken } from "@utils/helpers";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "@assets/css/notificationlist.css"; // Updated styles
import Sidebar from "../sidebar";

const NotificationList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [token, setToken] = useState(getToken());
  const [refresh, setRefresh] = useState(false);

  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const userRoles = currentUser?.roles;
  const isCooperative = userRoles?.includes("Cooperative");
  const isCustomer = userRoles?.includes("Customer");

  const containerClass = isCooperative && isCustomer ? "coop-notif-container-coop" : "coop-notif-container";

  const { notifloading, notification } = useSelector((state) => state.getNotif);

  useEffect(() => {
    dispatch(singleNotification(userId, token));
  }, [dispatch, token, userId]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      dispatch(singleNotification(userId, token));
      setRefresh(false);
    }, 500);
  }, [dispatch, token]);

  const handleRead = (id, type) => {
    dispatch(readNotification(id, token));
    if (type === "order") {
      navigate("/cooporderlist");
    } else if (type === "product") {
      navigate("/productlist");
    } else if (type === "members") {
      navigate("/memberNot");
    } else if (type === "message") {
      navigate("/messenger");
    } else if (type === "wallet") {
      navigate("/withdrawlist");
    }
  };

  const handleReadAll = () => {
    dispatch(readAllNotifications(userId, token));
    onRefresh();
  };

  return (
    <div className={`coop-notification-container ${containerClass}`}>
      {/* Header Section */}
      <header className="coop-notification-header">
        <h2>📢 Notifications</h2>
        <button className="coop-notification-mark-all" onClick={handleReadAll}>
          Mark All as Read
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar />

      {/* Loading State */}
      {notifloading ? (
        <p className="coop-notification-loading">Loading...</p>
      ) : notification?.length > 0 ? (
        <ul className="coop-notification-list">
          {notification.map((item, index) => (
            <li
              key={index}
              className={`coop-notification-item ${item.readAt ? "coop-notification-read" : "coop-notification-unread"}`}
              onClick={() => handleRead(item._id, item.type)}
            >
              {/* Notification Image */}
              {item.url && <img src={item.url} alt="Notification" className="coop-notification-image" />}
              
              {/* Notification Content */}
              <div className="coop-notification-content">
                <h4 className="coop-notification-title">{item.title}</h4>
                <p className="coop-notification-message">{item.content}</p>
                <span className="coop-notification-timestamp">{moment(item.createdAt).fromNow()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="coop-notification-empty">No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationList;