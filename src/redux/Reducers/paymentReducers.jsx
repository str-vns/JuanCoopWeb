import  { ADD_PAYMENT,  CLEAR_PAYMENT, SET_PAYMENT,
    ADD_PAYDATA, SET_PAYDATA, CLEAR_PAYDATA
    } from '@redux/Constants/paymentConstants';
export const payItems = (state = {}, action) => {
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

export const payData = (state ={}, action) => {
    switch (action.type) {
        case ADD_PAYDATA:  
            return action.payload;
        case CLEAR_PAYDATA:
            return {};
        case SET_PAYDATA:
            return action.payload;
        default:
            return state;
    }
}