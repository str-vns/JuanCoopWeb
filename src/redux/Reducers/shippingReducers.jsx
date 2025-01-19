import { ADD_SHIPPING, CLEAR_SHIPPING, SET_SHIPPING } from '@redux/Constants/shippingConstants';
const shipItems = (state = {}, action) => {
    switch (action.type) {
        case ADD_SHIPPING:
            return action.payload;
        case CLEAR_SHIPPING:
            return {};
        case SET_SHIPPING:
            return action.payload;

        default:
            return state;
    }
}

export default shipItems;