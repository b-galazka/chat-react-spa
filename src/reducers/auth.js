import {
    AUTH_REQUESTED, 
    AUTH_FAILED, 
    AUTH_SUCCEEDED, 
    PUT_TOKEN
} from '../actionsTypes/auth';

import {CLEAR_STORE} from '../actionsTypes/entireStore';

const initialState = {
    authenticating: false,
    authError: null,
    token: null,
    tokenData: null
};

export default function authReducer(state = initialState, action) {

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
                authError: action.payload
            };
        }
            
        case AUTH_SUCCEEDED: {

            const {token, tokenData} = action.payload;

            return {
                ...state,
                authenticating: false,
                authError: null,
                token,
                tokenData
            };
        }

        case PUT_TOKEN: {

            const {token, tokenData} = action.payload;

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