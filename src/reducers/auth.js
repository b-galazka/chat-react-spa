import {
    AUTH_REQUESTED, 
    AUTH_FAILED, 
    AUTH_SUCCEEDED, 
    PUT_TOKEN
} from '../actions/types/auth';

import { CLEAR_STORE } from '../actions/types/entireStore';

const initialState = {
    authenticating: false,
    authError: null,
    token: null,
    tokenData: null
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

            const { token, tokenData } = payload;

            return {
                ...state,
                authenticating: false,
                authError: null,
                token,
                tokenData
            };
        }

        case PUT_TOKEN: {

            const { token, tokenData } = payload;

            return {
                ...state,
                token,
                tokenData
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