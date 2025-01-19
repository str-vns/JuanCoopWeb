import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST } from '@redux/Constants/authConstants';

export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            case LOGOUT_REQUEST:
            return { userLoading: true }
        case LOGIN_SUCCESS:
            return { userLoading: false, user: action.payload }
        case LOGIN_FAILURE:
            return { userLoading: false, userError: action.payload }
        default:
            return state
    }
}