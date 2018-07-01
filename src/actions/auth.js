import {
    AUTH_REQUESTED,
    AUTH_SUCCEEDED,
    AUTH_FAILED,
    PUT_USER_DATA
} from './types/auth';

export function putUserData(username) {

    return {
        type: PUT_USER_DATA,
        payload: { username }
    };
}

export function authenticate(username, password) {

    return {
        type: AUTH_REQUESTED,
        username,
        password
    };
}

export function authSuccess(username) {

    return {
        type: AUTH_SUCCEEDED,
        payload: { username }
    };
}

export function authFailure(error) {

    return {
        type: AUTH_FAILED,
        payload: error
    };
}