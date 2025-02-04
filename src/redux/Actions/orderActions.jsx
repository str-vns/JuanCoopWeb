import axios from 'axios';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  FETCH_ORDERS_REQUEST, 
  FETCH_ORDERS_SUCCESS, 
  FETCH_ORDERS_FAILURE,
  ORDER_UPDATE_STATUS_REQUEST,
  ORDER_UPDATE_STATUS_SUCCESS,
  ORDER_UPDATE_STATUS_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_COOP_USER_REQUEST,
  ORDER_COOP_USER_SUCCESS,
  ORDER_COOP_USER_FAIL,
  SHIPPED_ORDER_FAIL,
  SHIPPED_ORDER_REQUEST,
  SHIPPED_ORDER_SUCCESS,
  HISTORY_DELIVERY_COOP_REQUEST,
  HISTORY_DELIVERY_COOP_SUCCESS,
  HISTORY_DELIVERY_COOP_FAIL,
  COOP_DASHBOARD_REQUEST, 
  COOP_DASHBOARD_SUCCESS, 
  COOP_DASHBOARD_FAIL,

  OVERALL_DASHBOARD_REQUEST, 
  OVERALL_DASHBOARD_SUCCESS, 
  OVERALL_DASHBOARD_FAIL
} from '../Constants/orderConstants';
import baseURL from '@Commons/baseUrl';

// ok
export const createOrder = (orderData, token) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    
    const config = {
      headers: {
       'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${baseURL}order`, orderData, config);

    // Check if the data contains the order object directly or within another key
    const order = data?.order || data;
    if (!order) {
      throw new Error("Order creation response is missing order data.");
    }

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: { order },
    });

    return { order };
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response?.data.message || error.message,
    });
    throw new Error(error.response?.data.message || "Order creation failed");
  }
};

//ok
export const fetchUserOrders = (userId, token) => async (dispatch) => {
    dispatch({ type: FETCH_ORDERS_REQUEST });
  
    try {
      const response = await axios.get(`${baseURL}order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ 
        type: FETCH_ORDERS_SUCCESS, 
        payload: response.data.details });
    } catch (error) {
      dispatch({
        type: FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Action to update the status of an order (cancel an order)
export const cancelOrder = (productId, token) => async (dispatch) => {
  console.log('cancelOrder', productId);
    try {
      dispatch({ type: ORDER_UPDATE_STATUS_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Set the status to 'Cancelled' for pending orders
      const { data } = await axios.put(`${baseURL}order/edit/${orderId}`, { status: 'Cancelled' }, config);
  
      dispatch({ type: ORDER_UPDATE_STATUS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_STATUS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
// Action to update the status of an order
export const updateOrderStatus = (orderId, status, token) => async (dispatch, getState) => {

  try {
    dispatch({ type: ORDER_UPDATE_STATUS_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`${baseURL}order/edit/${orderId}`,status,  config);

    dispatch({ type: ORDER_UPDATE_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_UPDATE_STATUS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Action to delete an order
export const deleteOrder = (productId, token) => async (dispatch, getState) => {
  console.log('cancelOrder', productId);
  try {
    dispatch({ type: ORDER_DELETE_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`${baseURL}order/delete/${productId}`, config);

    dispatch({ type: ORDER_DELETE_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: ORDER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const fetchCoopOrders = (coopId, token) => async (dispatch) => {

  try{
  
    dispatch({ type: ORDER_COOP_USER_REQUEST });
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const { data } = await axios.get(`${baseURL}coop/ordersList/${coopId}`, config);
  
    dispatch({ type: ORDER_COOP_USER_SUCCESS, payload: data.details });

  } catch (error) {
    dispatch({
      type: ORDER_COOP_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}

export const shippedOrder = (orderId, token) => async (dispatch) => {
  try {
    dispatch({ type: SHIPPED_ORDER_REQUEST });
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}orders/shipping/${orderId}`, config);

    dispatch({ type: SHIPPED_ORDER_SUCCESS, payload: data.details });

  } catch (error) {

    dispatch({
      type: SHIPPED_ORDER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });

    console.error("Error shipping order ", error);
  }
}

export const historyDeliveryCoop = (coopId, token) => async (dispatch) => {

  console.log(token)

  try {
    dispatch({ type: HISTORY_DELIVERY_COOP_REQUEST });
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}orders/delivery/history/${coopId}`, config);
   
    dispatch({ type: HISTORY_DELIVERY_COOP_SUCCESS, payload: data.details });

  } catch (error) {
    
    dispatch({
      type: HISTORY_DELIVERY_COOP_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });

    console.error("Error getting delivery history ", error);
  }
}

export const fetchCoopDashboardData = (coopId, token) => async (dispatch) => {
  try {
    dispatch({ type: COOP_DASHBOARD_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}coopdashboard/${coopId}`, config);  

    dispatch({ type: COOP_DASHBOARD_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: COOP_DASHBOARD_FAIL,
      payload: error.response?error.response.data.message : error.message,
    });
  }
};
export const fetchOverallDashboardData = (token) => async (dispatch) => {
  try {
    dispatch({ type: OVERALL_DASHBOARD_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${baseURL}overalldashboard`, config);

    dispatch({ type: OVERALL_DASHBOARD_SUCCESS, payload: data.details });
  } catch (error) {
    dispatch({
      type: OVERALL_DASHBOARD_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
