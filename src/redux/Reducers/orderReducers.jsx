// import {
//     FETCH_ORDERS_REQUEST, 
//     FETCH_ORDERS_SUCCESS, 
//     FETCH_ORDERS_FAILURE,
//     ORDER_UPDATE_STATUS_REQUEST,
//     ORDER_UPDATE_STATUS_SUCCESS,
//     ORDER_UPDATE_STATUS_FAIL,
//     ORDER_DELETE_REQUEST,
//     ORDER_DELETE_SUCCESS,
//     ORDER_DELETE_FAIL,
//   } from '../Constants/orderConstants';
  
//   const initialState = {
//     loading: false,
//     orders: [],
//     error: null,
//   };
  
//   export const orderReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case FETCH_ORDERS_REQUEST:
//       case ORDER_UPDATE_STATUS_REQUEST:
//       case ORDER_DELETE_REQUEST:
//         return { ...state, loading: true, error: null };
  
//       case FETCH_ORDERS_SUCCESS:
//         return { ...state, loading: false, orders: action.payload };
  
//       case ORDER_UPDATE_STATUS_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           orders: state.orders.map((order) =>
//             order._id === action.payload._id ? action.payload : order
//           ),
//         };
  
//       case ORDER_DELETE_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           orders: state.orders.filter((order) => order._id !== action.payload),
//         };
  
//       case FETCH_ORDERS_FAILURE:
//       case ORDER_UPDATE_STATUS_FAIL:
//       case ORDER_DELETE_FAIL:
//         return { ...state, loading: false, error: action.payload };
  
//       default:
//         return state;
//     }
//   };
  