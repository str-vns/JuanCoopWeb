import axios from "axios";
import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  OTP_USER_FAIL,
  OTP_USER_REQUEST,
  OTP_USER_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAIL,
  WISH_USER_REQUEST,
  WISH_USER_SUCCESS,
  WISH_USER_FAIL,
  USER_MESSAGE_FAIL,
  USER_MESSAGE_REQUEST,
  USER_MESSAGE_SUCCESS,
  WISHLIST_FAIL,
  WISHLIST_REQUEST,
  WISHLIST_SUCCESS,
  GET_ALL_USERS_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_SOFTDELETE_REQUEST,
  USER_SOFTDELETE_SUCCESS,
  USER_SOFTDELETE_FAIL,
  USER_RESTORE_REQUEST,
  USER_RESTORE_SUCCESS,
  USER_RESTORE_FAIL,
  CLEAR_ERRORS,
  CLEAR_REGISTER,
  COUNT_USER_REQUEST, 
  COUNT_USER_SUCCESS,
  COUNT_USER_FAIL,
  SAVE_USER_DEVICE_TOKEN_REQUEST,
  SAVE_USER_DEVICE_TOKEN_SUCCESS,
  SAVE_USER_DEVICE_TOKEN_FAIL,
  CHECK_EMAIL_REQUEST,
  CHECK_EMAIL_SUCCESS,
  CHECK_EMAIL_FAIL,
  OTP_FORGOT_PASSWORD_REQUEST,  
  OTP_FORGOT_PASSWORD_SUCCESS,
  OTP_FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
} from "../Constants/userConstants";
import baseURL from '@Commons/baseUrl'; 
import { toast } from 'react-toastify';
import { login } from "@redux/actions/authActions";

export const registeruser = (userData) => async (dispatch) => {

  try {
    dispatch({ type: REGISTER_USER_REQUEST });
     console.log("userData", userData);
    const formData = new FormData();
    formData.append("firstName", userData?.fname);
    formData.append("lastName", userData?.lname);
    formData.append("age", userData?.age);
    formData.append("email", userData?.email);
    formData.append("phoneNum", userData?.phone);
    formData.append("password", userData?.password);
    formData.append("gender", userData?.gender);
    formData.append("otp", userData.otp);
    if(userData?.avatar){
      formData.append("image", userData?.avatar);
    } 

 
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",  
      },
    };

    const { data } = await axios.post(`${baseURL}users`, formData, config);
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: {
        ...data.details,   
        password: userData?.password,  
      },
    });

     localStorage.removeItem("UserRegister");
     dispatch(login({ email: userData.email, password: userData.password }));
    //  toast.success("Register successfully!", {
    //   theme: "dark",
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: "Success_01",
    //   toastId: 'sessionExpired',
    //   closeButton: false,
    //   });

  } catch (error) {
    const errorMessage = 
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: REGISTER_USER_FAIL,
      payload: errorMessage,
    });

     toast.error("Regsiter Failed. Please try again.", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: "unSuccess_01",
          toastId: 'sessionExpired',
          closeButton: false,
          });

    console.log("Error from Register", errorMessage);
  }
};

export const OTPregister = (OtpData) => async (dispatch) => {
  try {
    dispatch({ type: OTP_USER_REQUEST });


    const { data } = await axios.post(`${baseURL}send-otp`, OtpData);

 
    dispatch({
      type: OTP_USER_SUCCESS,
      payload: data.user,
    });


   toast.success("OTP send successfully!", {
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
  
    console.error("Error from OTP:", error);


    dispatch({
      type: OTP_USER_FAIL,
      payload:
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    // Show error message
     toast.error("Failed to send OTP. Please try again.", {
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

    // Optional: log specific details
    console.log(
      "Error details:",
      error.response && error.response.data ? error.response.data : error.message
    );
  }
};

export const Profileuser = (userDataId, token) => async (dispatch) => {
  console.log("userDataId", userDataId);
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };

    // Correct API request URL
    const { data } = await axios.get(`${baseURL}user/${userDataId}`, config);

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data.details, // Assuming `data.details` contains user data
    });
  } catch (error) {
    const errorMessage =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: USER_PROFILE_FAIL,
      payload: errorMessage,
    });

    console.log("Error from ", errorMessage); // Logs the error message
  }
};

export const getUsers = (userIds, token) => async (dispatch) => {
  try {
    dispatch({ type: USER_MESSAGE_REQUEST });

    // Validate input
    if (!Array.isArray(userIds)) {
      throw new Error("Invalid input: userIds must be an array.");
    }

    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    // Prepare user requests
    const userRequests = userIds.map((userId) =>
      axios
        .get(`${baseURL}user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => ({
          error: true,
          message: err.response?.data?.message || err.message,
        }))
    );

    // Execute requests concurrently
    const responses = await Promise.all(userRequests);

    // Filter out failed requests and log them
    const failedRequests = responses.filter((res) => res.error);
    if (failedRequests.length) {
      console.warn("Some requests failed:", failedRequests);
    }

    // Extract successful responses
    const users = responses
      .filter((res) => !res.error)
      .map((res) => res.data);

    dispatch({
      type: USER_MESSAGE_SUCCESS,
      payload: users,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred.";

    dispatch({
      type: USER_MESSAGE_FAIL,
      payload: errorMessage,
    });

    console.error("Error from getUsers:", errorMessage);
  }
};

export const checkEmail = (email) => async (dispatch) => {

  try {

    dispatch({ type: CHECK_EMAIL_REQUEST });

    const { data } = await axios.post(`${baseURL}check-email`, email);
    console.log("Data from checkEmail:", data);
    dispatch({
      type: CHECK_EMAIL_SUCCESS,
      payload: data.details,
    });
  }
  catch (error)  {
    console.log("Error from checkEmail:", error);
    dispatch({
      type: CHECK_EMAIL_FAIL,
      payload: error.response && error.response.data
        ? error.response.data.details.message
        : error.message,
    });
  }
};
