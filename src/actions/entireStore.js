import {LOGOUT, CLEAR_STORE} from '../actionsTypes/entireStore';

export function logout() {

    return {
        type: LOGOUT
    };
}

export function clearStore() {

    return {
        type: CLEAR_STORE
    };
}