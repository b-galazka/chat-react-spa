import {
    AUTH_REQUESTED,
    AUTH_SUCCEEDED,
    AUTH_FAILED,
    FETCHING_CURRENT_USER_SUCCEEDED,
    FETCHING_CURRENT_USER_REQUESTED,
    FETCHING_CURRENT_USER_FAILED
} from './types/auth';

export function authenticate(username, password) {

    return {
        type: AUTH_REQUESTED,
        username,
        password
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