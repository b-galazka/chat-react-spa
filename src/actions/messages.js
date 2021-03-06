import {
    FETCHING_REQUESTED,
    FETCHING_FAILED,
    FETCHING_SUCCEDED,
    FETCHING_MORE_REQUESTED,
    FETCHING_MORE_SUCCEDED,
    FETCHING_MORE_FAILED,
    SEND,
    SEND_AGAIN,
    SAVED,
    SENDING_ERROR,
    RECEIVED,
    MARK_AS_READ,
    TYPING_STARTED,
    TYPING_FINISHED,
    TYPING_FINISH_REQUESTED
} from './types/messages';

export function fetchMessages() {

    return {
        type: FETCHING_REQUESTED
    };
}

export function fetchMoreMessages(lastMessageID) {

    return {
        type: FETCHING_MORE_REQUESTED,
        lastMessageID
    };
}

export function sendMessage(message) {

    return {
        type: SEND,
        payload: {
            ...message,
            sendingError: false
        }
    };
}

export function sendMessageAgain(message) {

    return {
        type: SEND_AGAIN,
        payload: message
    };
}

export function fetchingSuccess(messages) {

    return {
        type: FETCHING_SUCCEDED,
        payload: messages
    };
}

export function fetchingFailure(error) {

    return {
        type: FETCHING_FAILED,
        payload: error
    };
}

export function fetchingMoreSuccess(messages) {

    return {
        type: FETCHING_MORE_SUCCEDED,
        payload: messages
    };
}

export function fetchingMoreFailure(error) {

    return {
        type: FETCHING_MORE_FAILED,
        payload: error
    };
}

export function messageSaved(message, tempId) {

    return {
        type: SAVED,
        payload: message,
        tempId
    };
}

export function messageSendingError(tempId) {

    return {
        type: SENDING_ERROR,
        payload: tempId
    };
}

export function receiveMessage(message) {

    return {
        type: RECEIVED,
        payload: message
    };
}

export function markMessagesAsRead() {

    return {
        type: MARK_AS_READ
    };
}

export function startTyping() {

    return {
        type: TYPING_STARTED
    };
}

export function finishTyping(delayTime = 0) {

    return {
        type: TYPING_FINISH_REQUESTED,
        delayTime
    };
}

export function typingFinished() {

    return {
        type: TYPING_FINISHED
    };
}