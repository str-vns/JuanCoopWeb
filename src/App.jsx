import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast} from 'react-toastify';
import { gapi } from 'gapi-script';
import 'react-toastify/dist/ReactToastify.css';

// import Sidebar from "./Components/layout/sidebar"; // Capitalized Sidebar
import Register from "./Components/User/Register";
import Login from "@components/User/Login";
import ForgotPassword from "./Components/User/forgotPassword";
import SingleProduct from "./Components/Products/SingleProduct";
import Homepage from "./Components/Products/Homepage";
// import Navbar from "./Components/layout/navbar";
import CoopLocation from "./components/Map/CoopLocation";
import "./App.css";
import ProductCard from "./Components/Products/SingleProduct";
import Carts from "./Components/Cart/Cart";
// import Bill from "./Components/Cart/Billing";
import CheckoutAccordion from "./Components/Cart/checkout";
import OrderConfirmation from "./Components/Cart/confirm";
import Profile from "./Components/User/Profile";
import WishList from "./Components/User/Wishlist";
// import OrderList from "./Components/Order/Orderlist";
import Orders from "./Components/Order/Orders";
import CoopDashboard from "./components/Cooperative/Dashboard/CoopDashboard";
import ProductList from "./components/Cooperative/Product/ProductList";
import BlogList from "./components/Cooperative/Blog/BlogList";
import ForumPostList from "./components/Cooperative/Forum/ForumPostList";
import CoopProfileEdit from "./components/Cooperative/Profile/editProfile";
import ForumList from "./components/Cooperative/Forum/ForumList";
import ProductArchive from "./components/Cooperative/Product/ProductArchive";
// import ForumPost from "./Components/Cooperative/Forum/ForumPost";
import CoopOrderList from "./components/Cooperative/Order/OrderList";
import MessageList from "./components/Cooperative/Messages/MessageList";
import CoopLogin from "./components/Cooperative/Registration/CoopLogin";
import FarmRegistration from "./components/Cooperative/Registration/FarmRegistration";
import GoogleLogin from "./components/Cooperative/Registration/GoogleLogin";
import Messenger from './Components/Chatime/messenger/Messenger';
import CoopMessenger from './components/cooperative/Chatime/messenger/Messenger'
import  Shipping from "./Components/Cart/Address";
import Payment from "./Components/Cart/Payment";
import Address from "./components/Address/addressList"
import AddressCreate from "./components/Address/addressCreate";
import AddressEdit from "./components/Address/addressEdit";
import OtpRegister from "@components/user/otpRegister";
import { logoutUser } from "@redux/actions/authActions";
import { useDispatch } from "react-redux";
import ProtectedRoute from "@route/ProtectedRoute";
import RegisterRoute from "@route/RegisterRoute";
import InventoryList from "./components/Cooperative/Inventory/InventoryList";
import InventoryDetail from "./components/Cooperative/Inventory/InventoryDetail";
import InventoryCreate from "@components/Cooperative/Inventory/InventoryCreate";
import InventoryUpdate from "./Components/Cooperative/Inventory/InventoryUpdate";

import UserList from "./Components/Admin/User/UserList";
import TypeList from "@components/Admin/Types/TypeList";
import CategoryList from "./components/Admin/Categories/CategoryList";
import BlogLists from "@components/Admin/Blogs/Bloglist";

import PasswordReset from "@components/user/passwordReset";
import EditProfile from "@components/user/EditProfile";
import AdminDashboard from "@components/Admin/admin";
import { getCurrentUser } from "@utils/helpers";
import RoleBaseRoute from "@route/RoleBaseRoute";

const isTokenExpired = () => {
  const tokenExpire = localStorage.getItem("token_expiry");
  const currentDate = new Date();
  
  if (!tokenExpire) {
    console.error("Token expiry not set in localStorage.");
    return false; 
  }
  const tokenExpireDate = new Date(tokenExpire);

  console.log("Token Expiry:", tokenExpireDate);
  console.log("Current Date:", currentDate);
  if (currentDate.toDateString() === tokenExpireDate.toDateString()) {
    if (currentDate > tokenExpireDate) {
      console.log("Token Expired");
      return true;
    }
  }
  return false; 
};


function App() {
  const dispatch = useDispatch();
  const user = getCurrentUser()

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT,
        scope: "",
      })
    }
    
    gapi.load("client:auth2", start)
  },[])

  useEffect(() => {
    if (isTokenExpired()) {
      dispatch(logoutUser())
      toast.error('Session Expired', {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: 'sessionExpired',
        closeButton: false,
      });
    } 

  }, [dispatch]);

  // localStorage.removeItem('user')
  // localStorage.removeItem('jwt')
 
  return (
    <Router>
       <ToastContainer/>
      <div>
        {/* <Sidebar /> Uncomment if you need the Sidebar */}
        <Routes>
          <Route path="/" element={<RoleBaseRoute/>} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/resetPassword/:id" element={<PasswordReset/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<RegisterRoute> <OtpRegister /> </RegisterRoute>} />
          <Route path="/m" element={<Messenger/>}/>
          <Route path="/googlelogin" element={<GoogleLogin/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />

          {/* Order Routes */}
          <Route path="/product/:id" element={<ProductCard />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/cart" element={<Carts/>} />
          <Route path="/shipping" element={<Shipping/>} />
          <Route path="/payment" element={<Payment/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/wishlist" element={<WishList/>} />
          <Route path="/confirm" element={<OrderConfirmation />} />
          <Route path="/checkout" element={<CheckoutAccordion/>} />
          <Route path="/prod" element={<SingleProduct/>} />
        
         
          {/* <Route path="/forgot" element={<ForgotPassword />} /> */}


          <Route path="/location" element={<CoopLocation/>} />
          <Route path="/cooplogin" element={<CoopLogin/>} />
          <Route path="/farmregistration" element={<FarmRegistration/>} />
          <Route path="/coopdashboard" element={<CoopDashboard/>} />
          <Route path="/coopprofileedit" element={<CoopProfileEdit/>} />
          <Route path="/productlist" element={<ProductList/>} />
          <Route path="/messagelist" element={<MessageList/>} />
          <Route path="/productarchive" element={<ProductArchive/>} />
          <Route path="/forumlist" element={<ForumList/>} />
          <Route path="/forumpostlist" element={<ForumPostList/>} />

          {/* Inventory */}
          <Route path="/inventorylist" element={<InventoryList/>} />
          <Route path="/inventorydetail" element={<InventoryDetail/>} />
          <Route path="/inventorycreate" element={<InventoryCreate/>} />
          <Route path="/inventoryupdate" element={<InventoryUpdate/>} />
          <Route path="/cooporderlist" element={<CoopOrderList/>} />
          <Route path="/messenger" element={<CoopMessenger/>} />

          {/* <Route path="/orderlist" element={<OrderList/>} /> */}

          {/* User address */}
          <Route path="/addressList" element={ <ProtectedRoute isCustomer={true}> <Address/></ProtectedRoute>} />
          <Route path="/address/create" element={ <ProtectedRoute isCustomer={true}><AddressCreate/></ProtectedRoute>} />
          <Route path="/address/edit/:id" element={ <ProtectedRoute isCustomer={true}><AddressEdit/></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/userlist" element={<UserList/>} />
          <Route path="/typelist" element={<TypeList/>} />
          <Route path="/bloglist" element={<BlogList/>} />

        <Route path="/bloglists" element={<BlogLists/>} />
          <Route path="/categorylist" element={<CategoryList/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
