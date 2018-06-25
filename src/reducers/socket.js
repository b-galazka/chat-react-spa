import {
    PUT,
    DISCONNECTION,
    CONNECTION_SUCCEEDED,
    CONNECTION_FAILED,
    RECONNECTION_SUCCEEDED,
    RECONNECTION_FAILED
} from '../actions/types/socket';

import { CLEAR_STORE } from '../actions/types/entireStore';

const initialState = {
    socket: null,
    connected: false,
    connectionError: null
};

export default function socketReducer(state = initialState, action) {

    switch (action.type) {

        case PUT: {

            return {
                ...state,
                socket: action.payload
            };
        }

        case RECONNECTION_SUCCEEDED:
        case CONNECTION_SUCCEEDED: {

            return {
                ...state,
                connected: true
            };
        }

        case RECONNECTION_FAILED:
        case CONNECTION_FAILED: {

            return {
                ...state,
                connectionError: true
            };
        }

        case DISCONNECTION: {

            return {
                ...state,
                connected: false
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
};