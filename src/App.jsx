import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast} from 'react-toastify';
import { gapi } from 'gapi-script';
import 'react-toastify/dist/ReactToastify.css';

// import Sidebar from "./Components/layout/sidebar"; // Capitalized Sidebar
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import ForgotPassword from "./components/user/forgotPassword";
import SingleProduct from "./components/Products/SingleProduct";
import Homepage from "./components/Products/Homepage";
// import Navbar from "./Components/layout/navbar";
import CoopLocation from "./components/Map/CoopLocation";
import "./App.css";
import ProductCard from "./components/Products/SingleProduct";
import Carts from "./components/Cart/Cart";
// import Bill from "./Components/Cart/Billing";
import CheckoutAccordion from "./components/Cart/checkout";
import OrderConfirmation from "./components/Cart/confirm";


import Profile from "./components/user/Profile";
import WishList from "./components/user/Wishlist";
// import OrderList from "./Components/Order/Orderlist";
import Orders from "./components/Order/Orders";
import QrGenerate from "./components/Order/QrGenerate";
import UserAddReview from "./components/user/UserAddReviews";

import CoopDashboard from "./components/cooperative/Dashboard/CoopDashboard";
import OverallDashboard from "./components/Admen/Dashboard/OverallDashboard";
import ProductList from "./components/cooperative/Product/ProductList";
import BlogList from "./components/cooperative/Blog/BlogList";
import ForumPostList from "./components/cooperative/Forum/ForumPostList";
import CoopProfileEdit from "./components/cooperative/Profile/editProfile";
import ForumList from "./components/cooperative/Forum/ForumList";
import ProductArchive from "./components/cooperative/Product/ProductArchive";
// import ForumPost from "./Components/Cooperative/Forum/ForumPost";
import CoopOrderList from "./components/cooperative/Order/OrderList";
import MessageList from "./components/cooperative/Messages/MessageList";
import CoopLogin from "./components/cooperative/Registration/CoopLogin";
import FarmRegistration from "./components/cooperative/Registration/FarmRegistration";
import GoogleLogin from "./components/cooperative/Registration/GoogleLogin";
import Messenger from './components/Chatime/messenger/Messenger';
import CoopMessenger from './components/cooperative/Chatime/messenger/Messenger'
import Shipping from "./components/Cart/Address";
import Payment from "./components/Cart/Payment";
import Address from "./components/Address/addressList"
import AddressCreate from "./components/Address/addressCreate";
import AddressEdit from "./components/Address/addressEdit";
import OtpRegister from "./components/user/otpRegister";
import { logoutUser } from "@redux/Actions/authActions";
import { useDispatch } from "react-redux";
import ProtectedRoute from "@route/ProtectedRoute";
import RegisterRoute from "@route/RegisterRoute";
import Dashboard from "./components/Admen/Dashboard/AdminDashboard";
import RrankProduct from "./components/Admen/Dashboard/RrankProduct";
import UserList from "./components/Admen/User/UserList";
import InventoryList from "./components/cooperative/Inventory/InventoryList";
import InventoryDetail from "./components/cooperative/Inventory/InventoryDetail";
import InventoryCreate from "./components/cooperative/Inventory/InventoryCreate";
import InventoryUpdate from "./components/cooperative/Inventory/InventoryUpdate";

import TypeList from "./components/Admen/Types/TypeList";
import TypeCreate from "./components/Admen/Types/TypeCreate";
import TypeUpdate from "./components/Admen/Types/TypeUpdate";

import CategoryList from "./components/Admen/Categories/CategoryList";
import CategoryCreate from "./components/Admen/Categories/CategoryCreate";
import CategoryUpdate from "./components/Admen/Categories/CategoryUpdate";

import BlogLists from "./components/Admen/Blogs/Bloglist";
import BlogCreate from "./components/Admen/Blogs/BlogCreate";
import BlogUpdate from "./components/Admen/Blogs/BlogUpdate";

import DriverList from "./components/Admen/Drivers/Driverlist";
import DriverDetails from "./components/Admen/Drivers/DriverDetails";
import DriverNotApproved from "./components/Admen/Drivers/DriverNotApproved";

import Cooplist from "./components/Admen/Coops/CoopList";
import CoopDetails from "./components/Admen/Coops/CoopDetails";
import CoopNotApproved from "./components/Admen/Coops/CoopNotApproved";

import PostList from "./components/Admen/Post/Postlist";

import PasswordReset from "./components/user/passwordReset";
import EditProfile from "./components/user/EditProfile";
// import AdminDashboard from "./components/admin/admin";

import MemberList from "./components/cooperative/Member/MemberList";
import FarmerProfile from "./components/cooperative/Profile/FarmerProfile";

import { getCurrentUser } from "@utils/helpers";
import RoleBaseRoute from "@route/RoleBaseRoute";


import MemberRegistration from "./components/user/MemberRegistration";
import MemberNotApprove from "./components/Cooperative/Member/MemberNotApprove";
import MemberDetails from "./components/Cooperative/Member/MemberDetails";
import ReviewRatingList from "./components/Cooperative/Review/ReviewRatingList";
import ReviewRating from "./components/Cooperative/Review/ReviewRating";
import NotificationList from "./components/Cooperative/Notifications/NotificationList";
import RiderList from "./components/Cooperative/Rider/RiderList";
import AssignList from "./components/Cooperative/Rider/AssignList";

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
          <Route path="/qr" element={<QrGenerate/>} />
          <Route path="/review" element={<UserAddReview/>} />
          <Route path="/wishlist" element={<WishList/>} />
          <Route path="/checkout" element={<CheckoutAccordion/>} />
          <Route path="/confirm" element={<OrderConfirmation />} />
          <Route path="/prod" element={<SingleProduct/>} />
        
         
          {/* <Route path="/forgot" element={<ForgotPassword />} /> */}


          <Route path="/location" element={<CoopLocation/>} />
          <Route path="/cooplogin" element={<CoopLogin/>} />
          <Route path="/farmregistration" element={<FarmRegistration/>} />
          <Route path="/coopdashboard" element={<CoopDashboard/>} />
          <Route path="/overalldashboard" element={<OverallDashboard/>} />
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

          <Route path="/reviewratinglist" element={<ReviewRatingList/>} />
          <Route path="/reviews/:id" element={<ReviewRating/>}/>

          <Route path="/notificationlist" element={<NotificationList/>} />

          <Route path="/memberlist" element={<MemberList/>} />
          <Route path="/memberNot" element={<MemberNotApprove/>} />
          <Route path="/member-details/:id" element={<MemberDetails/>} />

          <Route path="/messenger" element={<CoopMessenger/>} />

          {/* <Route path="/orderlist" element={<OrderList/>} /> */}

          {/* User address */}
          <Route path="/addressList" element={ <ProtectedRoute isCustomer={true}> <Address/></ProtectedRoute>} />
          <Route path="/address/create" element={ <ProtectedRoute isCustomer={true}><AddressCreate/></ProtectedRoute>} />
          <Route path="/address/edit/:id" element={ <ProtectedRoute isCustomer={true}><AddressEdit/></ProtectedRoute>} />

          {/* Admin */}
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/barGraph" element={<RrankProduct />} />
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
          <Route path="/forumpostlist" element={<ForumPostList/>} />

          <Route path="/bloglist" element={<BlogList/>} />

          <Route path="/categorylist" element={<CategoryList/>} />
          <Route path="/category-create" element={<CategoryCreate/>} />
          <Route path="/category-update/:id" element={<CategoryUpdate/>} />
        
          <Route path="/memberRegistration" element={<MemberRegistration/>} />
          <Route path="/farmerprofile/:coopId" element={<FarmerProfile />} />

          <Route path="/chat/:conversationId" element={<Messenger />} />
          <Route path="/coopchat/:conversationId" element={<CoopMessenger />} />

  
          <Route path="/riderlist" element={<RiderList/>}/>
          <Route path="/assignlist" element={<AssignList/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
