import {
    AUTH_REQUESTED, 
    AUTH_FAILED, 
    AUTH_SUCCEEDED, 
    PUT_USER_DATA
} from 'actions/types/auth';

import { CLEAR_STORE } from 'actions/types/entireStore';

const initialState = {
    authenticating: false,
    authError: null,
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

        case PUT_USER_DATA: {

            return {
                ...state,
                user: payload
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