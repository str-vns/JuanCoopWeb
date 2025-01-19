import  { ADD_PAYMENT,  CLEAR_PAYMENT, SET_PAYMENT } from '@redux/Constants/paymentConstants';
const payItems = (state = {}, action) => {
    switch (action.type) {
        case ADD_PAYMENT:
            return action.payload;
        case CLEAR_PAYMENT:
            return {};
        case SET_PAYMENT:
            return action.payload;

        default:
            return state;
    }
}

export default payItems;