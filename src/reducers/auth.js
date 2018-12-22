import {
    AUTH_REQUESTED,
    AUTH_FAILED,
    AUTH_SUCCEEDED,
    FETCHING_CURRENT_USER_REQUESTED,
    FETCHING_CURRENT_USER_SUCCEEDED,
    FETCHING_CURRENT_USER_FAILED,
    LOGOUT_REQUESTED,
    LOGOUT_FAILED
} from 'actions/types/auth';

import { CLEAR_STORE } from 'actions/types/entireStore';

const initialState = {
    authenticating: false,
    authError: null,
    fetchingCurrentUser: false,
    fetchingCurrentUserError: null,
    fetchingCurrentUserSuccess: false,
    loggingOut: false,
    logoutError: null,
    user: null
};

export default function authReducer(state = initialState, action) {

    const { payload } = action;

    switch (action.type) {

        case AUTH_REQUESTED: {

            return {
                ...state,
                authenticating: true,
                authError: null
            };
        }

        case AUTH_FAILED: {

            return {
                ...state,
                authenticating: false,
                authError: payload
            };
        }

        case AUTH_SUCCEEDED: {

            return {
                ...state,
                authenticating: false,
                authError: null,
                user: payload
            };
        }

        case FETCHING_CURRENT_USER_REQUESTED: {

            return {
                ...state,
                fetchingCurrentUser: true,
                fetchingCurrentUserError: null,
                fetchingCurrentUserSuccess: false
            };
        }

        case FETCHING_CURRENT_USER_SUCCEEDED: {

            return {
                ...state,
                fetchingCurrentUser: false,
                fetchingCurrentUserError: null,
                fetchingCurrentUserSuccess: true,
                user: payload
            };
        }

        case FETCHING_CURRENT_USER_FAILED: {

            return {
                ...state,
                fetchingCurrentUser: false,
                fetchingCurrentUserError: payload,
                fetchingCurrentUserSuccess: false
            };
        }

        case LOGOUT_REQUESTED: {

            return {
                ...state,
                loggingOut: true,
                logoutError: null
            };
        }

        case LOGOUT_FAILED: {

            return {
                ...state,
                loggingOut: false,
                logoutError: payload
            };
        }

        case CLEAR_STORE: {

            return {
                ...initialState
            };
        }

        default: {

            return state;
        }
    }
}