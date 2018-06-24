import {LOGOUT, CLEAR_STORE} from './types/entireStore';

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