import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast} from 'react-toastify';
import { gapi } from 'gapi-script';
import 'react-toastify/dist/ReactToastify.css';

// Importing user-related components
import Register from "@components/user/Register";
import Login from "@components/user/Login";
import ForgotPassword from "@components/user/ForgotPassword";
import PasswordReset from "@components/user/PasswordReset";
import OtpRegister from "@components/user/OtpRegister";
import Profile from "@components/user/Profile";
import EditProfile from "@components/user/EditProfile";
import WishList from "@components/user/Wishlist";

// Importing product-related components
import SingleProduct from "@components/products/SingleProduct";
import Homepage from "@components/products/Homepage";
import ProductCard from "@components/products/SingleProduct";

// Importing cart-related components
import Carts from "@components/cart/Cart";
import CheckoutAccordion from "@components/cart/Checkout";
import OrderConfirmation from "@components/cart/Confirm";
import Shipping from "@components/cart/Address";
import Payment from "@components/cart/Payment";

// Importing address-related components
import Address from "@components/address/AddressList";
import AddressCreate from "@components/address/AddressCreate";
import AddressEdit from "@components/address/AddressEdit";

// Importing order-related components
import Orders from "@components/order/Orders";

// Importing cooperative-related components
import CoopDashboard from "@components/cooperative/dashboard/CoopDashboard";
import ProductList from "@components/cooperative/product/ProductList";
import ProductArchive from "@components/cooperative/product/ProductArchive";
import BlogList from "@components/cooperative/blog/BlogList";
import ForumList from "@components/cooperative/forum/ForumList";
import ForumPostList from "@components/cooperative/forum/ForumPostList";
import CoopProfileEdit from "@components/cooperative/profile/EditProfile";
import CoopOrderList from "@components/cooperative/order/OrderList";
import MessageList from "@components/cooperative/messages/MessageList";
import CoopLogin from "@components/cooperative/registration/CoopLogin";
import FarmRegistration from "@components/cooperative/registration/FarmRegistration";
import GoogleLogin from "@components/cooperative/registration/GoogleLogin";
import InventoryList from "@components/cooperative/inventory/InventoryList";
import InventoryDetail from "@components/cooperative/inventory/InventoryDetail";
import InventoryCreate from "@components/cooperative/inventory/InventoryCreate";
import InventoryUpdate from "@components/cooperative/inventory/InventoryUpdate";
import MemberList from "@components/cooperative/member/MemberList";

// Importing admin-related components
import Dashboard from "@components/admin/Adashboard";
import RankedProductsPage from "@components/admin/RankProduct";
import UserList from "@components/admin/user/UserList";
import TypeList from "@components/admin/types/TypeList";
import TypeCreate from "@components/admin/types/TypeCreate";
import TypeUpdate from "@components/admin/types/TypeUpdate";
import CategoryList from "@components/admin/categories/CategoryList";
import BlogLists from "@components/admin/blogs/BlogList";
import BlogCreate from "@components/admin/blogs/BlogCreate";
import BlogUpdate from "@components/admin/blogs/BlogUpdate";
import DriverList from "@components/admin/drivers/DriverList";
import DriverDetails from "@components/admin/drivers/DriverDetails";
import DriverNotApproved from "@components/admin/drivers/DriverNotApproved";
import CoopList from "@components/admin/coops/CoopList";
import CoopDetails from "@components/admin/coops/CoopDetails";
import CoopNotApproved from "@components/admin/coops/CoopNotApproved";
import PostList from "@components/admin/post/PostList";

// Importing utility functions and routes
import { logoutUser } from "@redux/actions/authActions";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@utils/helpers";
import RoleBaseRoute from "@route/RoleBaseRoute";
import ProtectedRoute from "@route/ProtectedRoute";
import RegisterRoute from "@route/RegisterRoute";

// Importing chat-related components
import Messenger from "@components/chatime/messenger/Messenger";
import CoopMessenger from "@components/cooperative/chatime/messenger/Messenger";

// Importing CSS

import MemberList from "@components/Cooperative/Member/MemberList";
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
          <Route path="/memberlist" element={<MemberList/>} />
          <Route path="/messenger" element={<CoopMessenger/>} />

          {/* <Route path="/orderlist" element={<OrderList/>} /> */}

          {/* User address */}
          <Route path="/addressList" element={ <ProtectedRoute isCustomer={true}> <Address/></ProtectedRoute>} />
          <Route path="/address/create" element={ <ProtectedRoute isCustomer={true}><AddressCreate/></ProtectedRoute>} />
          <Route path="/address/edit/:id" element={ <ProtectedRoute isCustomer={true}><AddressEdit/></ProtectedRoute>} />

          {/* Admin */}
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/barGraph" element={<RankedProductsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userlist" element={<UserList/>} />

          <Route path="/typelist" element={<TypeList/>} />
          <Route path="/typecreate" element={<TypeCreate/>} />
          <Route path="/typeupdate/:id" element={<TypeUpdate/>} />

          <Route path="/bloglists" element={<BlogLists/>} />
          <Route path="/blogcreate" element={<BlogCreate/>} />
          <Route path="/blogupdate/:id" element={<BlogUpdate/>} />

          <Route path="/driverlist" element={<DriverList/>} />
          <Route path="/driverNot" element={<DriverNotApproved/>} />
          <Route path="/driver-details/:id" element={<DriverDetails />} />
        
          <Route path="/cooplist" element={<Cooplist/>} />
          <Route path="/coopNot" element={<CoopNotApproved/>} />
          <Route path="/coop-details/:coopId" element={<CoopDetails />} />

          <Route path="/postlist" element={<PostList/>} />
          <Route path="/bloglist" element={<BlogList/>} />

          <Route path="/categorylist" element={<CategoryList/>} />
          
        
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
