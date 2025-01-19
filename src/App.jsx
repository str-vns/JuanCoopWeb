import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from "./Components/layout/sidebar"; // Capitalized Sidebar
import Register from "./Components/User/Register";
import Login from "./Components/User/Login";
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
import CoopDashboard from "./Components/Cooperative/Dashboard/CoopDashboard";
import ProductList from "./Components/Cooperative/Product/ProductList";
import BlogList from "./Components/Cooperative/Blog/BlogList";
import ForumPostList from "./Components/Cooperative/Forum/ForumPostList";
import CoopProfileEdit from "./Components/Cooperative/Profile/editProfile";
import ForumList from "./Components/Cooperative/Forum/ForumList";
import ProductArchive from "./Components/Cooperative/Product/ProductArchive";
// import ForumPost from "./Components/Cooperative/Forum/ForumPost";
import CoopOrderList from "./Components/Cooperative/Order/OrderList";
import MessageList from "./Components/Cooperative/Messages/MessageList";
import CoopLogin from "./Components/Cooperative/Registration/CoopLogin";
import FarmRegistration from "./Components/Cooperative/Registration/FarmRegistration";
import GoogleLogin from "./Components/Cooperative/Registration/GoogleLogin";
import Messenger from './Components/Chatime/messenger/Messenger';
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
import InventoryList from "./Components/Cooperative/Inventory/InventoryList";
import InventoryDetail from "./Components/Cooperative/Inventory/InventoryDetail";
import InventoryCreate from "./Components/Cooperative/Inventory/InventoryCreate";
import InventoryUpdate from "./Components/Cooperative/Inventory/InventoryUpdate";


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

 
  return (
    <Router>
       <ToastContainer/>
      <div>
        {/* <Sidebar /> Uncomment if you need the Sidebar */}
        <Routes>
          {/* Define Routes with 'element' prop */}
          <Route path="/" element={<Homepage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/product/:id" element={<ProductCard />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/location" element={<CoopLocation/>} />
          <Route path="/m" element={<Messenger/>}/>
          <Route path="/cart" element={<Carts/>} />
          <Route path="/shipping" element={<Shipping/>} />
          <Route path="/payment" element={<Payment/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/wishlist" element={<WishList/>} />
            
          <Route path="/confirm" element={<OrderConfirmation />} />
          <Route path="/checkout" element={<CheckoutAccordion/>} />
          <Route path="/prod" element={<SingleProduct/>} />
        
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<RegisterRoute> <OtpRegister /> </RegisterRoute>} />
          {/* <Route path="/forgot" element={<ForgotPassword />} /> */}

          <Route path="/cooplogin" element={<CoopLogin/>} />
          <Route path="/googlelogin" element={<GoogleLogin/>} />
          <Route path="/forgotpassword" element={<ForgotPassword/>} />
          <Route path="/farmregistration" element={<FarmRegistration/>} />
          <Route path="/coopdashboard" element={<CoopDashboard/>} />
          <Route path="/coopprofileedit" element={<CoopProfileEdit/>} />
          <Route path="/productlist" element={<ProductList/>} />
          <Route path="/messagelist" element={<MessageList/>} />
          <Route path="/productarchive" element={<ProductArchive/>} />
          <Route path="/bloglist" element={<BlogList/>} />
          <Route path="/forumlist" element={<ForumList/>} />
          <Route path="/forumpostlist" element={<ForumPostList/>} />
          <Route path="/inventorylist" element={<InventoryList/>} />
          <Route path="/inventorydetail" element={<InventoryDetail/>} />
          <Route path="/inventorycreate" element={<InventoryCreate/>} />
          <Route path="/inventoryupdate" element={<InventoryUpdate/>} />
          <Route path="/cooporderlist" element={<CoopOrderList/>} />
          {/* <Route path="/orderlist" element={<OrderList/>} /> */}

          {/* User address */}
          <Route path="/addressList" element={<Address  />} />
          <Route path="/address/create" element={<AddressCreate />} />
          <Route path="/address/edit/:id" element={<AddressEdit  />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
