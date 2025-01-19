import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, UPDATE_CART_QUANTITY, SET_CART_ITEMS } from "@redux/Constants/cartConstants";

const cartItems = (state = [], action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return action.payload;
        case REMOVE_FROM_CART:
            return state.filter(item => item.inventoryId !== action.payload);
        case CLEAR_CART:
            return [];
        case UPDATE_CART_QUANTITY:
            return state.map(item =>
                item.inventoryId === action.payload.inventoryId ?
                    { ...item, quantity: action.payload.quantity } :
                    item
            );
        case SET_CART_ITEMS:
            return action.payload;

        default:
            return state;
    }
}

export default cartItems;