import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { singleNotification, readAllNotifications, readNotification } from '@src/redux/Actions/notificationActions';
import { getCurrentUser, getToken } from "@utils/helpers";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "@assets/css/notificationlist.css"; // Import styles
import Sidebar from "../sidebar";

const NotificationList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [token, setToken] = useState(getToken());
  const [refresh, setRefresh] = useState(false);

  // Fetch user details
  const currentUser = getCurrentUser();
  const userId = currentUser?._id;
  const userRoles = currentUser?.roles;
  const isCooperative = userRoles?.includes("Cooperative");
  const isCustomer = userRoles?.includes("Customer");

  // Apply dynamic styling based on user roles
  const containerClass = isCooperative && isCustomer ? "container-coop" : "container";

  // Redux state for notifications
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
  }, [dispatch, token, userId]);

  const handleRead = (id, type) => {
    dispatch(readNotification(id, token));
    if (type === "order") {
      navigate("/user/orders");
    } else if (type === "message") {
      navigate("/messages");
    }
    onRefresh();
  };

  const handleReadAll = () => {
    dispatch(readAllNotifications(userId, token));
    onRefresh();
  };

  return (
    <div className={containerClass}>
      <header className="header">
        <button className="menu-button" onClick={() => navigate("/menu")}>
          ☰
        </button>
        <h2>Notifications</h2>
      </header>

      <Sidebar/>

      <button className="mark-all" onClick={handleReadAll}>Mark All as Read</button>

      {notifloading ? (
        <p>Loading...</p>
      ) : notification?.length > 0 ? (
        <ul className="notification-list">
          {notification.map((item, index) => (
            <li key={index} className={`notification-item ${item.readAt ? "read" : "unread"}`} onClick={() => handleRead(item._id, item.type)}>
              {item.url && <img src={item.url} alt="Notification" className="notif-image" />}
              <div className="notif-content">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
                <span className="timestamp">{moment(item.createdAt).fromNow()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationList;