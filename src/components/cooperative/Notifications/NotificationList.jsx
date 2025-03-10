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
    }
  };

  const handleReadAll = () => {
    dispatch(readAllNotifications(userId, token));
    onRefresh();
  };

  return (
    <div className={containerClass}>
      <header className="coop-notif-header">
        <h2>📢 Notifications</h2>
        <button className="coop-notif-mark-all" onClick={handleReadAll}>Mark All as Read</button>
      </header>

      <Sidebar />

      {notifloading ? (
        <p className="coop-notif-loading">Loading...</p>
      ) : notification?.length > 0 ? (
        <ul className="coop-notif-list">
          {notification.map((item, index) => (
            <li 
              key={index} 
              className={`coop-notif-item ${item.readAt ? "coop-notif-read" : "coop-notif-unread"}`} 
              onClick={() => handleRead(item._id, item.type)}
            >
              {item.url && <img src={item.url} alt="Notification" className="coop-notif-image" />}
              <div className="coop-notif-content">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
                <span className="coop-notif-timestamp">{moment(item.createdAt).fromNow()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="coop-notif-empty">No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationList;