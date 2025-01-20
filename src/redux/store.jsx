import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { thunk } from "redux-thunk";
import cartItems from "@redux/Reducers/cartReducers";
import payItems from "@redux/Reducers/paymentReducers";
import shipItems from "@redux/Reducers/shippingReducers";
import { authReducer } from "@redux/Reducers/authReducers";
import { OTPReducer, RegisterReducer, userReducer, EditProfileReducer, getUsersReducers, AllUsersReducer, checkEmailReducer, otpForgotPasswordReducer, googleLoginReducer } from "@redux/Reducers/userReducers";
import { addressReducers } from "@redux/Reducers/addressReducers";
import {
  orderReducer,
  orderCoopReducer,
  orderShippedReducer,
  historyDeliveryCoopReducer,
} from "./Reducers/orderReducer";
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
  coopAllReducer,
  coopOrderReducer,
  coopOrderUpdateReducer,
  coopActiveReducer,
} from "@redux/Reducers/coopReducers";
import { HereMapReducer, MapBoxRouteReducer } from "@redux/Reducers/locationReducers";


import { reducerProduct, reducerCoop, reducerCoopProduct, reducerCreateProduct, reducerEditProduct, reducerDelResProduct } from "@redux/Reducers/productReducers";
import { categoryListReducer} from "@redux/Reducers/categoryReducers";
import { typeListReducer} from "@redux/Reducers/typeReducers";
import { inventoryCreateReducer, singleInventoryReducer } from "@redux/Reducers/inventoryReducers";
const reducers = combineReducers({
  cartItems: cartItems,
  payItems: payItems,
  shipItems: shipItems,
  authInfo: authReducer,
  userOnly: userReducer,
  addresses: addressReducers,
  orders: orderReducer,
  coopOrdering: orderCoopReducer,
  orderShipped: orderShippedReducer,
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
  allProducts: reducerProduct,
  singleCoop: reducerCoop,
  CoopProduct: reducerCoopProduct,
  createProduct: reducerCreateProduct,
  UpdateProduct: reducerEditProduct,
  ResDelProduct: reducerDelResProduct,
  categories: categoryListReducer, 
  types: typeListReducer, 
  invent: inventoryCreateReducer,
  sinvent: singleInventoryReducer,
  Geolocation: HereMapReducer,
  MapBoxRoute: MapBoxRouteReducer,
  otp: OTPReducer,
  register: RegisterReducer,
  EditProfile: EditProfileReducer,
  allUsers: AllUsersReducer,
  checkDuplication: checkEmailReducer,
  googleLogin: googleLoginReducer,
  otpForgot: otpForgotPasswordReducer,
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
