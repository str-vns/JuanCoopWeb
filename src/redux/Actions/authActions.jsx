import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE } from '@redux/Constants/authConstants';
import { authenticated } from '@utils/helpers';
import axios from 'axios';
import baseURL from '@Commons/baseUrl';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
const unSuccess = "Unsuccessful_01";
const success = "Successful_02";


export const login = (user) => async (dispatch) => {
  try {
      dispatch({ type: LOGIN_REQUEST });

      const config = {
          headers: {
              "Content-Type": "application/json",
          },
          withCredentials: true, 
      };

      const { data } = await axios.post(`${baseURL}signin`, user, config);
      
      Cookies.set('jwt', data.details.accessToken, { expires: 7 });
      dispatch({
          type: LOGIN_SUCCESS,
          payload: data.details,
      });
        toast.success("Login Successful", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: "success",
          closeButton: false,
        });
      
      authenticated(data.details);
  } catch (error) {
    
      dispatch({
          type: LOGIN_FAILURE,
          payload: error.message,
      });


      console.error(error);
  }
};

export const logoutUser = () => async (dispatch) => {
  
  try {
    dispatch({ type: LOGOUT_REQUEST });

   
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, 
    };

    await axios.post(`${baseURL}signout`, {}, config);
 

    dispatch({
      type: LOGOUT_SUCCESS,
      payload: {},
      
    });
    
    toast.success('Logout successful', {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
    });
    
  } catch (error) {
    dispatch({
      type: LOGOUT_FAILURE,
      payload: error.message,
    });

    console.error('Logout failed:', error);

    toast.error('Logout unsuccessful. Please try again.', {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      closeButton: false,
    });
  }
};

export const getUserProfile = (id) => {
  fetch(`${baseURL}users/${id}`, {
      method: "GET",
      body: JSON.stringify(user),
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
  })
  .then((res) => res.json())
  // .then((data) => console.log(data));
}