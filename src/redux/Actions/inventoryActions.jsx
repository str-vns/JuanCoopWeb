import {
    INVENTORY_CREATE_REQUEST,
    INVENTORY_CREATE_SUCCESS,
    INVENTORY_CREATE_FAIL,
    INVENTORY_UPDATE_REQUEST,
    INVENTORY_UPDATE_SUCCESS,
    INVENTORY_UPDATE_FAIL,
    INVENTORY_DELETE_REQUEST,
    INVENTORY_DELETE_SUCCESS,
    INVENTORY_DELETE_FAIL,
    INVENTORY_ACTIVE_REQUEST,
    INVENTORY_ACTIVE_SUCCESS,
    INVENTORY_ACTIVE_FAIL,
    SINGLE_INVENTORY_REQUEST,
    SINGLE_INVENTORY_SUCCESS,
    SINGLE_INVENTORY_FAIL,
    INVENTORY_PRODUCTS_REQUEST,
    INVENTORY_PRODUCTS_SUCCESS,
    INVENTORY_PRODUCTS_FAIL,
  } from "@redux/Constants/inventoryConstants";
  import axios from "axios";
  import baseURL from '@Commons/baseUrl';
  
  /**
   * Create a new inventory item.
   */
  export const createInventory = (inventory, token) => async (dispatch) => {
    try {
      dispatch({ type: INVENTORY_CREATE_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.post(`${baseURL}inventory`, inventory, config);
  
      dispatch({
        type: INVENTORY_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: INVENTORY_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  /**
   * Update an existing inventory item.
   */
  export const updateInventory = (inventory, inventoryId, token) => async (dispatch) => {
    try {
      dispatch({ type: INVENTORY_UPDATE_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.put(
        `${baseURL}inventory/update/${inventoryId}`,
        inventory,
        config
      );
  
      dispatch({
        type: INVENTORY_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: INVENTORY_UPDATE_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };
  
  /**
   * Delete an inventory item.
   */
  export const deleteInventory = (inventoryId, token) => async (dispatch) => {
    try {
      dispatch({ type: INVENTORY_DELETE_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.delete(`${baseURL}inventory/${inventoryId}`, config);
  
      dispatch({
        type: INVENTORY_DELETE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: INVENTORY_DELETE_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };
  
  /**
   * Mark an inventory item as active.
   */
  export const activeInventory = (inventoryId, token) => async (dispatch) => {
    try {
      dispatch({ type: INVENTORY_ACTIVE_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.put(`${baseURL}inventory/active/${inventoryId}`, {}, config);
  
      dispatch({
        type: INVENTORY_ACTIVE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: INVENTORY_ACTIVE_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };
  
  /**
   * Fetch details of a single inventory item.
   */
  export const singleInventory = (inventoryId, token) => async (dispatch) => {
    try {
      dispatch({ type: SINGLE_INVENTORY_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.get(`${baseURL}inventory/${inventoryId}`, config);
  
      dispatch({
        type: SINGLE_INVENTORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SINGLE_INVENTORY_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };
  
  /**
   * Fetch products associated with an inventory item.
   */
  export const inventoryProducts = (inventoryId, token) => async (dispatch) => {
    try {
      dispatch({ type: INVENTORY_PRODUCTS_REQUEST });
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.get(`${baseURL}inventory/product/${inventoryId}`, config);
  
      dispatch({
        type: INVENTORY_PRODUCTS_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      dispatch({
        type: INVENTORY_PRODUCTS_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };
  