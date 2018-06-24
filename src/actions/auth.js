import {
    AUTH_REQUESTED,
    AUTH_SUCCEEDED,
    AUTH_FAILED,
    PUT_TOKEN
} from './types/auth';

export function putToken(token, tokenData) {

    return {
        type: PUT_TOKEN,
        payload: {
            token,
            tokenData
        }
    }
}

export function authenticate(username, password) {

    return {
        type: AUTH_REQUESTED,
        username,
        password
    }
}

export function authSuccess(token, tokenData) {

    return {
        type: AUTH_SUCCEEDED,
        payload: {
            token,
            tokenData
        }
    };
}

export function authFailure(error) {

    return {
        type: AUTH_FAILED,
        payload: error
    };
}