import  { ADD_PAYMENT,  CLEAR_PAYMENT, SET_PAYMENT,
ADD_PAYDATA, SET_PAYDATA, CLEAR_PAYDATA
} from '@redux/Constants/paymentConstants';
const persistPayToStorage = async (payItems) => {
    try {
      localStorage.setItem("payItems", JSON.stringify(payItems));
    } catch (error) {
      console.error("Error persisting Payment to storage:", error);
    }
  }
  
  const persistPayDataToStorage = async (payDataItems) => {
    try {
      localStorage.setItem("payDataItems", JSON.stringify(payDataItems));
    } catch (error) {
      console.error("Error persisting Payment to storage:", error);
    }
  }

  export const addPay = (payload) => {
    return async (dispatch) => {
      try {
     
         localStorage.setItem("payItems", JSON.stringify(payload));
        // localStorage.removeItem("payItems");
        // console.log(localStorage.getItem("payItems"),"caray");
        // console.log("Updated Payment Item:", payItems);
  
        dispatch({
          type: ADD_PAYMENT,
          payload: payload,
        });
      } catch (error) {
        console.error("Error updating Payment items:", error);
      }
    };
  };

export const clearPay = () => {
    return async (dispatch) => {
        dispatch({
            type: CLEAR_PAYMENT,
        })

       await persistPayToStorage({});
    }
}

export const setPayItems = (payItems) => {
    return async (dispatch) => {
        dispatch({
            type: SET_PAYMENT,
            payload: payItems,
        })
    }
}

export const addPaymentData = (payload) => {
  return async (dispatch) => {
    try {
   
       localStorage.setItem("payData", JSON.stringify(payload));
      // localStorage.removeItem("payItems");
      // console.log(localStorage.getItem("payItems"),"caray");
      // console.log("Updated Payment Item:", payItems);

      dispatch({
        type: ADD_PAYDATA,
        payload: payload,
      });
    } catch (error) {
      console.error("Error updating Payment items:", error);
    }
  };
};

 export const setPayDataItems = (payDataItems) => {
    return async (dispatch) => {
        dispatch({
            type: SET_PAYDATA,
            payload: payDataItems,
        })
    }
}

export const clearPayData = () => {
  return async (dispatch) => {
      dispatch({
          type: CLEAR_PAYDATA,
      })

     await persistPayDataToStorage({});
  }
}