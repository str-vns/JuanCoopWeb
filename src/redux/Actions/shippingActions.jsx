import { ADD_SHIPPING, CLEAR_SHIPPING, SET_SHIPPING } from '@redux/Constants/shippingConstants';
const persistShipToStorage = async (shipItems) => {
    try {
      localStorage.setItem("shipItems", JSON.stringify(shipItems));
    } catch (error) {
      console.error("Error persisting cart to storage:", error);
    }
  }
  
  
  export const addShip = (payload) => {
    return async (dispatch) => {
      try {
        const storedShipItems = localStorage.getItem("shipItems");
        let shipItems = storedShipItems ? JSON.parse(storedShipItems) : {};
  
        shipItems = { ...shipItems, ...payload };
  
        localStorage.setItem("shipItems", JSON.stringify(shipItems));
  
        console.log("Updated Ship Items:", shipItems);
  
        dispatch({
          type: ADD_SHIPPING,
          payload: shipItems,
        });
      } catch (error) {
        console.error("Error updating shipping items:", error);
      }
    };
  };

export const clearShip = () => {
    return async (dispatch) => {
        dispatch({
            type: CLEAR_SHIPPING,
        })

       await persistShipToStorage({});
    }
}

export const setShippingItems = (shipItems) => {
    return async (dispatch) => {
        dispatch({
            type: SET_SHIPPING,
            payload: shipItems,
        })
    }
}