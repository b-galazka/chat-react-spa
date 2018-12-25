import {
    PUT,
    DISCONNECTION,
    CONNECTION_SUCCEEDED,
    CONNECTION_FAILED,
    RECONNECTION_SUCCEEDED,
    RECONNECTION_FAILED
} from '@src/actions/types/socket';

import { CLEAR_STORE } from '@src/actions/types/entireStore';

const initialState = {
    socket: null,
    connected: false,
    connectionError: false
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
}