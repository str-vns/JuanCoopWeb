import axios from "axios";
import { GET_ADDRESSES, ADD_ADDRESS, UPDATE_ADDRESS, DELETE_ADDRESS, SINGLE_ADDRESS } from "../Constants/addressConstants";
import baseURL from '@Commons/baseUrl';
import { toast } from 'react-toastify';

export const fetchAddresses = (userId, token) => async (dispatch) => {

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await axios.get(`${baseURL}address/${userId}`, config);
    dispatch({
      type: GET_ADDRESSES,
      payload: response.data.details,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};

export const addAddress = (addressData, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.post(`${baseURL}address`, addressData, config);
    dispatch({
      type: ADD_ADDRESS,
      payload: response.data.details,
    });
 // Success notification
 toast.success("Address added successfully!", {
  theme: "dark",
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  toastId: 'sessionExpired',
  closeButton: false,
  });
  

} catch (error) {
  console.error("Error adding address:", error);
     // Error notification
     toast.error("Failed to add address. Please try again.", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: 'sessionExpired',
      closeButton: false,
      });
    }
  };

export const updateAddress = ( id, addressData, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.put(`${baseURL}address/${id}`, addressData, config);
    dispatch({
      type: UPDATE_ADDRESS,
      payload: response.data.details,
    });
    toast.success("Address Update successfully!", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: 'sessionExpired',
      closeButton: false,
      });
  } catch (error) {
    toast.error("Failed to Update Address. Please try again.", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: 'sessionExpired',
      closeButton: false,
      })
    console.error("Error updating address:", error);
  }
};

export const deleteAddress = (id, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    await axios.delete(`${baseURL}address/${id}`, config);
    dispatch({
      type: DELETE_ADDRESS,
      payload: id,
    });
    toast.success("Address Delete successfully!", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: 'sessionExpired',
      closeButton: false,
      });
  } catch (error) {
    console.error("Error deleting address:", error);
    toast.error("Failed to Delete address. Please try again.", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: 'sessionExpired',
      closeButton: false,
      })
  }
};

export const singleAddress = (id, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
   const {data} = await axios.get(`${baseURL}address/fetch/${id}`, config);
    dispatch({
      type: SINGLE_ADDRESS,
      payload: data.details,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
  }
};
