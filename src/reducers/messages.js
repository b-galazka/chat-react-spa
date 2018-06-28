import {
    FETCHING_REQUESTED,
    FETCHING_SUCCEDED,
    FETCHING_FAILED,
    FETCHING_MORE_REQUESTED,
    FETCHING_MORE_SUCCEDED,
    FETCHING_MORE_FAILED,
    SEND,
    SEND_AGAIN,
    SAVED,
    SENDING_ERROR,
    MARK_AS_READ,
    RECEIVED,
    TYPING_STARTED,
    TYPING_FINISHED,
    START_FILE_UPLOADING,
    FILE_UPLOADING_STARTED,
    FILE_PART_UPLOADED,
    FILE_UPLOADED,
    FILE_UPLOADING_ERROR
} from '../actions/types/messages';

import { CLEAR_STORE } from '../actions/types/entireStore';
import { RECONNECTION_SUCCEEDED } from '../actions/types/socket';

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
    unreadMessages: 0,

    typingMessage: false
};

export default function messagesReducer(state = initialState, action) {

    const { payload } = action;

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
                fetchingError: payload
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
                fetchingMoreError: payload
            };
        }

        case START_FILE_UPLOADING:
        case SEND: {

            return {
                ...state,
                sending: [...state.sending, payload]
            };
        }

        case SEND_AGAIN: {

            const { sending } = state;
            const { tempId } = payload;

            const sendingMessages = sending.map(message =>
                (message.tempId === tempId) ?
                    { ...message, sendingError: false } :
                    message
            );

            return {
                ...state,
                sending: sendingMessages
            };
        }

        case SAVED: {

            const { tempId } = action;
            const { sent, sending } = state;

            // prevents doubling messages sent during reconnection
            const doesMessageExist = sent.some(message => message.id === payload.id);

            return {
                ...state,
                sending: sending.filter(message => message.tempId !== tempId),
                sent: (doesMessageExist) ? sent : [...sent, payload]
            };
        }

        case SENDING_ERROR: {

            const { sending } = state;

            const sendingMessages = sending.map(message =>
                (message.tempId === payload) ?
                    { ...message, sendingError: true } :
                    message
            );

            return {
                ...state,
                sending: sendingMessages
            };
        }

        case RECEIVED: {

            const { sent, unreadMessages } = state;

            // prevents doubling messages received during reconnection
            const doesMessageExist = sent.some(message => message.id === payload.id);

            if (doesMessageExist) {

                return state;
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

            const { sending, ...newState } = initialState;

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

        case TYPING_STARTED: {

            return {
                ...state,
                typingMessage: true
            };
        }

        case TYPING_FINISHED: {

            return {
                ...state,
                typingMessage: false
            };
        }

        case FILE_UPLOADING_STARTED: {

            const { tempId, uploadId } = payload;
            const { sending } = state;

            const sendingMessages = sending.map(message =>
                (message.tempId === tempId) ?
                    { ...message, uploadId } :
                    message
            );

            return {
                ...state,
                sending: sendingMessages
            };
        }

        case FILE_PART_UPLOADED: {

            const { uploadId, uploadedBytes } = payload;
            const { sending } = state;

            const sendingMessages = sending.map((message) => {

                const { attachment } = message;

                if (!attachment || message.uploadId !== uploadId) {

                    return message;
                }

                return {
                    ...message,

                    attachment: {
                        ...attachment,
                        uploadedBytes
                    }
                };
            });

            return {
                ...state,
                sending: sendingMessages
            };
        }

        case FILE_UPLOADED: {

            const { uploadId, message } = payload;
            const { sent, sending } = state;

            // prevents doubling messages sent during reconnection
            const doesMessageExist = sent.some(
                existingMessage => existingMessage.id === message.id
            );

            return {
                ...state,
                sending: sending.filter(message => message.uploadId !== uploadId),
                sent: (doesMessageExist) ? sent : [...sent, message]
            };
        }

        case FILE_UPLOADING_ERROR: {

            const { uploadId, tempId, errorMessage } = payload;
            const { sending } = state;

            const sendingMessages = sending.map((message) => {

                const { attachment } = message;

                if (
                    !attachment ||
                    uploadId && message.uploadId !== uploadId ||
                    !uploadId && message.tempId !== tempId
                ) {

                    return message;
                }

                return {
                    ...message,

                    attachment: {
                        ...attachment,
                        uploadingError: errorMessage
                    }
                };
            });

            return {
                ...state,
                sending: sendingMessages
            };
        }

        default: {

            return state;
        }      
    }
}