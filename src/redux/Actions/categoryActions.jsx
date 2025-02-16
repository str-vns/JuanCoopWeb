import {
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_EDIT_REQUEST,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_EDIT_FAIL,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_CLEAR_ERRORS,
} from "../Constants/categoryConstants";

import baseURL from "@Commons/baseUrl";
import axios from "axios";
import mime from "mime"; // Ensure mime package is installed

export const categoryList = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    const { data } = await axios.get(`${baseURL}category`);
    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data.details, // Assuming `data.details` contains the list of categories
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.error("Category List Error:", error.message || error.response?.data);
  }
};


export const categoryCreate = (categoryData, image, token) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });

    const formData = new FormData();
    formData.append("categoryName", categoryData.categoryName);

    if (image instanceof File) {
      formData.append("image", image, image.name);
    } else {
      console.error("Invalid image file:", image);
      throw new Error("Invalid image file.");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    console.log("Sending category create request...");
    const { data } = await axios.post(`${baseURL}category`, formData, config);
    console.log("Category created successfully:", data);

    dispatch({ type: CATEGORY_CREATE_SUCCESS, payload: data });

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error creating category:", errorMessage);

    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload: errorMessage,
    });
  }
};


export const categoryEdit = (id, categoryData, token) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_EDIT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Sending request with payload:", categoryData);
    const { data } = await axios.put(`${baseURL}category/${id}`, categoryData, config);

    dispatch({
      type: CATEGORY_EDIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Error updating category:", errorMessage);
    dispatch({
      type: CATEGORY_EDIT_FAIL,
      payload: errorMessage,
    });
  }
};



export const categoryDelete = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DELETE_REQUEST });

    const { data } = await axios.delete(`${baseURL}category/${id}`);
    dispatch({
      type: CATEGORY_DELETE_SUCCESS,
      payload: data.details,
    });
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.message || error.message
      : "An unexpected error occurred.";
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload: errorMessage,
    });
    console.error("Category Delete Error:", errorMessage);
  }
};


