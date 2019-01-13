import {
    AUTH_REQUESTED,
    AUTH_SUCCEEDED,
    AUTH_FAILED,
    FETCHING_CURRENT_USER_SUCCEEDED,
    FETCHING_CURRENT_USER_REQUESTED,
    FETCHING_CURRENT_USER_FAILED,
    LOGOUT_REQUESTED,
    LOGOUT_FAILED
} from './types/auth';

export function authenticate(payload) {

    return {
        type: AUTH_REQUESTED,
        payload
    };
}

export function authSuccess(user) {

    return {
        type: AUTH_SUCCEEDED,
        payload: user
    };
}

export function authFailure(error) {

    return {
        type: AUTH_FAILED,
        payload: error
    };
}

export function fetchCurrentUser() {

    return {
        type: FETCHING_CURRENT_USER_REQUESTED
    };
}

export function fetchingCurrentUserFailure(error) {

    return {
        type: FETCHING_CURRENT_USER_FAILED,
        payload: error
    };
}

export function fetchingCurrentUserSuccess(user) {

    return {
        type: FETCHING_CURRENT_USER_SUCCEEDED,
        payload: user
    };
}

export function logout() {

    return {
        type: LOGOUT_REQUESTED
    };
}

export function logoutFailure(error) {

    return {
        type: LOGOUT_FAILED,
        payload: error
    };
}