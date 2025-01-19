import {
    MESSAGE_LIST_FAIL,
    MESSAGE_LIST_REQUEST,
    MESSAGE_LIST_SUCCESS,
    SEND_MESSAGE_FAIL,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
} from "../Constants/messageConstants";

import axios from "axios";
import baseURL from '@Commons/baseUrl';

export const listMessages = (id, token) => async (dispatch) => {
    try {
        dispatch({ type: MESSAGE_LIST_REQUEST });
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }, 
        }

        const { data } = await axios.get(`${baseURL}m/${id}`, config);
        console.log("data", data);
        dispatch({
        type: MESSAGE_LIST_SUCCESS,
        payload: data.details,
        });
    } catch (error) {
        dispatch({
        type: MESSAGE_LIST_FAIL,
        payload:
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        });
    }
}

export const sendingMessage = (message, token) => async (dispatch) => {
  console.log("message", message?.sender);

    try {
      dispatch({ type: SEND_MESSAGE_REQUEST });
      const formData = new FormData();
      formData.append("sender", message?.sender);
      formData.append("text", message?.text);
      formData.append("conversationId", message?.conversationId);
  
      
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
  
      const { data } = await axios.post(`${baseURL}m`, formData, config);
      console.log("data", data);  
      dispatch({
        type: SEND_MESSAGE_SUCCESS,
        payload: data.details,
      });
    } catch (error) {
      dispatch({
        type: SEND_MESSAGE_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };