import "../../assets/css/navbar.css";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getToken, isAuth, getCurrentUser } from "@utils/helpers";
import { logoutUser } from "@redux/actions/authActions";
import { setCartItems } from '@redux/Actions/cartActions';
import { setShippingItems } from '@redux/Actions/shippingActions';
import { setPayItems } from '@redux/Actions/paymentActions';
import { singleNotification, readAllNotifications, readNotification } from "@redux/Actions/notificationActions";
import { useEffect, useState } from "react";
import { useSocket } from "../../../SocketIo"
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = getCurrentUser();
  const socket = useSocket();
  const token = getToken();
  const auth = isAuth();
  const { notifloading, notification, notiferror } = useSelector((state) => state.getNotif);
  const cartItems = useSelector((state) => state.cartItems);
  const cartItemsCount = cartItems.length;
  const [isOpen, setIsOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  
  const handleRead = async(id, type) => {

    try {
      dispatch(readNotification(id, token));
      setNotifCount(0)
      if (type === "order")
      {
        navigate("/cart");
      }
      
    } catch (error) {
      console.error("Error marking as read: ", error);
    }
  };

  const handleReadAll = async() => {
    try{
      dispatch(readAllNotifications(user?._id, token));
      setNotifCount(0);
    }catch (error) {
      console.error("Error marking all as read: ", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const loadCartItems = () => {
      try {
        // Retrieve items from localStorage
        const storedCart = localStorage.getItem("cartItems");
        const storedShip = localStorage.getItem("shipItems");
        const storedPay = localStorage.getItem("payItems");

        // Parse and dispatch if items exist
        if (storedCart) {
          const cartItems = JSON.parse(storedCart);
          dispatch(setCartItems(cartItems));
        }

        if (storedShip) {
          const shipItems = JSON.parse(storedShip);
          dispatch(setShippingItems(shipItems));
        }

        if (storedPay) {
          const payItems = JSON.parse(storedPay)
          dispatch(setPayItems(payItems));
        }
      } catch (error) {
        console.error("Error loading items from localStorage:", error);
      }
    };
    setNotifCount(notification.filter((notif) => notif.readAt === null).length);
    loadCartItems();
  }, [dispatch, notification]);

  const fetchNotifications = async () => {
    if (user?._id) {
      const token = getToken();
       dispatch(singleNotification(user._id, token));
    }
  };

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        const unreadCount = notification.filter((notif) => notif.readAt === null).length;
        const notifCount = unreadCount + 1;
        setNotifCount(notifCount);
      });

      return () => {
        socket.off("getNotification");
      };
    }
  }, [socket]);

  const handleLogout = () => {
    navigate("/");

    dispatch(logoutUser());
    localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('isAuth');
        localStorage.removeItem('cartItems');
        Cookies.remove('jwt');
    window.location.reload();
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleBellClick = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      // Reset notification count and fetch latest state from backend
      await fetchNotifications();
      const unreadCount = notification.filter((notif) => notif.readAt === null).length;
      setNotifCount(unreadCount);
    }
  };

  return (
    <div className="navbar">
      {/* Left side with logo, search bar, and AgriCoop */}
      <div className="flex items-center">
        <img src={logo} alt="AgriCoop Logo" className="h-10 w-10 mr-2" />
        <a className="brand">JuanKooP</a>
      </div>

      {/* Centered menu items */}
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/location">Location</a>
          </li>

          <li>
            <a>About Us</a>
          </li>
        </ul>
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="ml-70 p-2 border rounded-md mr-4"
      />
      {/* Right side with cart and profile dropdown */}
      <div className="flex-none">
        {/* Cart Dropdown */}
        <div
          tabIndex={0}
          role="button"
          onClick={() => (window.location.href = "/cart")}
          style={{ cursor: "pointer" }}
        >
          {cartItemsCount > 0 && (
          <div className="indicator">
           
          <span className="count">{cartItemsCount}</span> 

          </div>
             )} 
          <i className="fas fa-shopping-cart fa-lg text-black text-xl"> {notifCount > 0 && (
            <span className="badge badge-sm bg-red-500 text-white ml-1">
              {notifCount}
            </span>
          )} </i>
          
        </div>

        
        <div className="dropdown dropdown-end relative">
      <div
        tabIndex={0}
        role="button"
        onClick={handleBellClick}
        className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
      >
        <i className="fas fa-bell text-black text-xl"></i>
        
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow absolute right-0"
 
        >
          <li>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Notifications
            </h4>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              read All
            </h4>
          </li>
          {notification.length > 0 ? (
            notification.map((notification, index) => (
              console.log(notification),
              <li key={index}  className={`border-b last:border-none py-4 px-2 rounded ${
                notification.readAt === null ?  "bg-yellow-100" : "bg-white" 
              }`}
              onClick={() => handleRead(notification._id, notification.type)}>
                
            
              <div className="notification-dropdown">
                <div className="notification-header ">
                  <span className="notification-title text-black">{notification.title}</span>
                  <span className="notification-date text-black">{notification.date}</span>
                </div>
            
                <div className="notification-content text-black">
                {notification.content}
                </div>
                <button className="read-button" onClick={() => handleReadAll()}>Read</button>
                <button className="read-all-button">Read All</button>
              </div>
              </li>
            ))
          ) : (
            <li className="py-2">
              <p className="text-sm text-gray-500">No new notifications</p>
            </li>
          )}
        </ul>
      )}
    </div>


        {/* User Profile Dropdown */}
        {auth ? (

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-black text-xl"></i>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <div className="flex items-center">
                  <i className="fas fa-id-badge text-black mr-2"></i>
                  <a href="/profile" className="text-black hover:underline">
                    Profile
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-black mr-2"></i>
                  <a href="/m">Messages</a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-heart text-black mr-2"></i>
                  <a href="/wishlist">Wishlist</a>
                 
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-box-open text-black mr-2"></i>
                  <a href="/orders" className="text-black hover:underline">
                  Orders
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-address-book text-black mr-2"></i>
                  <a href="/addressList" className="text-black hover:underline">
                  Address
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-sign-out-alt text-black mr-2"></i>
                  <a href="#" onClick={handleLogout}>Logout</a>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center">
            <i className="fas fa-sign-out-alt text-black mr-2"></i>
            <a href="#" onClick={handleLogin}>
              Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
