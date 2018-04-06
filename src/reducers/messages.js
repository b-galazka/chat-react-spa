import {
    FETCHING_REQUESTED,
    FETCHING_SUCCEDED,
    FETCHING_FAILED,
    FETCHING_MORE_REQUESTED,
    FETCHING_MORE_SUCCEDED,
    FETCHING_MORE_FAILED,
    SEND,
    SAVED,
    MARK_AS_READ,
    RECEIVED
} from '../actionsTypes/messages';

import {CLEAR_STORE} from '../actionsTypes/entireStore';
import {RECONNECTION_SUCCEEDED} from '../actionsTypes/socket';

import config from '../shared/config';

const initialState = {

    fetching: false,
    fetched: false,
    fetchingError: null,
    fetchedAll: false,

    fetchingMore: false,
    fetchingMoreError: null,
    fetchedMore: false,

    sending: [],
    sent: [],
    unreadMessages: 0
};

export default function messagesReducer(state = initialState, action) {

    switch (action.type) {

        case FETCHING_REQUESTED: {

            return {
                ...state,
                fetched: false,
                fetching: true,
                fetchingError: null
            };
        }
            
        case FETCHING_SUCCEDED: {

            const {payload} = action;

            return {
                ...state,
                fetching: false,
                fetched: true,
                fetchingError: null,
                sent: payload,
                fetchedAll: (payload.length < config.messagesPerFirstRequest)
            };
        }
            
        case FETCHING_FAILED: {

            return {
                ...state,
                fetched: false,
                fetching: false,
                fetchingError: action.payload
            };
        }

        case FETCHING_MORE_REQUESTED: {

            return {
                ...state,
                fetchedMore: false,
                fetchingMore: true,
                fetchingMoreError: null
            };
        }

        case FETCHING_MORE_SUCCEDED: {

            const {payload} = action;

            return {
                ...state,
                fetchingMore: false,
                fetchedMore: true,
                fetchingMoreError: null,
                sent: [...payload, ...state.sent],
                fetchedAll: (payload.length < config.messagesPerRequest)
            };
        }

        case FETCHING_MORE_FAILED: {

            return {
                ...state,
                fetchedMore: false,
                fetchingMore: false,
                fetchingMoreError: action.payload
            };
        }

        case SEND: {

            return {
                ...state,
                sending: [...state.sending, action.payload]
            };
        }

        case SAVED: {

            const {payload, tempID} = action;
            const {sent, sending} = state;

            // prevents doubling messages sent during reconnection
            const doesMessageExist = sent.some(message => message.id === payload.id);

            return {
                ...state,
                sending: sending.filter(message => message.tempID !== tempID),
                sent: (doesMessageExist) ? sent : [...sent, payload]
            };
        }

        case RECEIVED: {

            const {payload} = action;
            const {sent, unreadMessages} = state;

            // prevents doubling messages received during reconnection
            const doesMessageExist = sent.some(message => message.id === payload.id);

            if (doesMessageExist) {

                return {
                    ...state
                };
            }

            return {
                ...state,
                sent: [...sent, payload],
                unreadMessages: (document.hasFocus()) ? unreadMessages : unreadMessages + 1
            }
        }

        case MARK_AS_READ: {

            return {
                ...state,
                unreadMessages: 0
            };
        }

        case RECONNECTION_SUCCEEDED: {

            const {sending, ...newState} = initialState;

            return {
                ...state,
                ...newState
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