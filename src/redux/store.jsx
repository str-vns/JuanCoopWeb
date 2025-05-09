import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { thunk } from "redux-thunk";
import cartItems from "@redux/Reducers/cartReducers";
import { payItems , payData } from "@redux/Reducers/paymentReducers";
import shipItems from "@redux/Reducers/shippingReducers";
import { authReducer } from "@redux/Reducers/authReducers";
import { OTPReducer,RegisterReducer,userReducer,EditProfileReducer,getUsersReducers,AllUsersReducer,checkEmailReducer,otpForgotPasswordReducer,googleLoginReducer} from "@redux/Reducers/userReducers";
import { addressReducers } from "@redux/Reducers/addressReducers";
import { orderReducer,orderCoopReducer,orderShippedReducer,historyDeliveryCoopReducer, coopdashboardReducer,overalldashboardReducer,onlinePaymentReducer, getPaymentReducer} from "./Reducers/orderReducer";
import {
  messageListReducer,
  sendMessageReducer,
} from "@redux/Reducers/messageReducers";
import {
  conversationListReducer,
  conversationCreateReducer,
} from "@redux/Reducers/conversationReducers";
import {
  sendNotificationReducers,
  getNotificationReducers,
  readNotificationReducers,
} from "@redux/Reducers/notificationReducers";
import {
  coopYReducer,
  coopAllReducer,coopOrderReducer,coopOrderUpdateReducer,coopActiveReducer} from "@redux/Reducers/coopReducers";
import {HereMapReducer,MapBoxRouteReducer} from "@redux/Reducers/locationReducers";

import { reducerProduct, reducerCoop, reducerCoopProduct, reducerCreateProduct, reducerEditProduct, reducerDelResProduct } from "@redux/Reducers/productReducers";
import { categoryListReducer,categoryCreateReducer,categoryEditReducer} from "@redux/Reducers/categoryReducers";
import { typeListReducer, typeCreateReducer,typeUpdateReducer,typeDeleteReducer} from "@redux/Reducers/typeReducers";
import { inventoryCreateReducer, singleInventoryReducer, inventoryDashboardReducer } from "@redux/Reducers/inventoryReducers";
import { reducerBlog, reducerSingleBlog, reducerCreateBlog, reducerEditBlog, reducerDelBlog } from "@redux/Reducers/blogReducer";
import { driverApiReducer, driverListReducer, onlyApprovedDriverReducer, driverProfileReducer } from "@redux/Reducers/driverReducer";
// import postReducer from "./Reducers/postReducer";
import salesReducer from "./Reducers/salesReducer"; 
import rankedReducer from "./Reducers/rankReducers";
import { commentcreateReducers } from "@redux/Reducers/commentReducers";
import { walletReducer } from "@redux/Reducers/walletReducers";

import { transactionReducer, transactionAPIReducer, refundReducer } from "@redux/Reducers/transactionReducer";
import { memberListReducer, memberApiReducer } from "@redux/Reducers/memberReducer";
import { postReducer, addCommentReducer, getCommentsReducer, postLikeReducer } from "@redux/Reducers/postReducer";
import { deliveryListReducer, deliveryApiReducer, deliveryCompleteReducer, deliveryHistoryReducer } from "@redux/Reducers/deliveryReducers";
import { cancelledReducerApi, cancelledReducer } from "@redux/Reducers/cancelledReducer";
import { AddComment } from "@mui/icons-material";
const reducers = combineReducers({
  sales: salesReducer,
  rank: rankedReducer,
  cartItems: cartItems,
  payItems: payItems,
  payData: payData,
  shipItems: shipItems,
  authInfo: authReducer,
  userOnly: userReducer,
  addresses: addressReducers,
  orders: orderReducer,
  coopOrdering: orderCoopReducer,
  orderShipped: orderShippedReducer,
  coopdashboards: coopdashboardReducer,
  overalldashboards: overalldashboardReducer,
  deliveredhistory: historyDeliveryCoopReducer,
  getMessages: messageListReducer,
  sendMessages: sendMessageReducer,
  createConversation: conversationCreateReducer,
  converList: conversationListReducer,
  getThemUser: getUsersReducers,
  getNotif: getNotificationReducers,
  readNotif: readNotificationReducers,
  sendNotification: sendNotificationReducers,
  coopActive: coopActiveReducer,
  upOrders: coopOrderUpdateReducer,
  coopOrders: coopOrderReducer,
  allofCoops: coopAllReducer,
  Coop: coopYReducer,
  singleCoop: reducerCoop,
  allProducts: reducerProduct,
  CoopProduct: reducerCoopProduct,
  createProduct: reducerCreateProduct,
  UpdateProduct: reducerEditProduct,
  ResDelProduct: reducerDelResProduct,
  categories: categoryListReducer, 
  categoriesCreate: categoryCreateReducer,
  categoriesUpdate: categoryEditReducer,
  types: typeListReducer, 
  typesCreate: typeCreateReducer,
  typesUpdate: typeUpdateReducer,
  typesDelete: typeDeleteReducer,
  invent: inventoryCreateReducer,
  sinvent: singleInventoryReducer,
  inventoryDashboard: inventoryDashboardReducer,
  Geolocation: HereMapReducer,
  MapBoxRoute: MapBoxRouteReducer,
  otp: OTPReducer,
  register: RegisterReducer,
  EditProfile: EditProfileReducer,
  allUsers: AllUsersReducer,
  checkDuplication: checkEmailReducer,
  googleLogin: googleLoginReducer,
  otpForgot: otpForgotPasswordReducer,

  allBlogs: reducerBlog, 
  singleBlog: reducerSingleBlog, 
  createBlog: reducerCreateBlog, 
  updateBlog: reducerEditBlog, 
  deleteBlog: reducerDelBlog, 

  post: postReducer,
  AddComment: addCommentReducer,
  getComments: getCommentsReducer,
  postLike: postLikeReducer,

  onlyApprovedDriver: onlyApprovedDriverReducer,
  driverList: driverListReducer,
  driverApi: driverApiReducer,
  driverProfile: driverProfileReducer,

  memberList: memberListReducer,
  memberApi: memberApiReducer,

  createComment: commentcreateReducers,


  deliveryList: deliveryListReducer,
  deliveryComplete: deliveryCompleteReducer,
  deliveryApi: deliveryApiReducer,
  deliveryHistory: deliveryHistoryReducer,

  cancelled: cancelledReducer,
  cancelledApi: cancelledReducerApi,

  onlinePay: onlinePaymentReducer,
  getPayment: getPaymentReducer,
  getWallet: walletReducer,
  transaction: transactionReducer,
  transactionAPI: transactionAPIReducer,
  refund: refundReducer
});

let initialState = {
  user: {
    user: {},
    isAuth: false,
  },
  auth: {},
};

const store = createStore(reducers, initialState, applyMiddleware(thunk));

export default store;
