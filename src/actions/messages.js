import {
    FETCHING_REQUESTED,
    FETCHING_FAILED,
    FETCHING_SUCCEDED,
    FETCHING_MORE_REQUESTED,
    FETCHING_MORE_SUCCEDED,
    FETCHING_MORE_FAILED,
    SEND,
    SAVED,
    RECEIVED,
    MARK_AS_READ,
    TYPING_STARTED,
    TYPING_FINISHED,
    TYPING_FINISH_PROCESSING
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
        payload: message
    };
}

export function fetchingSuccess(messages) {

    return {
        type: FETCHING_SUCCEDED,
        payload: messages
    }
}

export function fetchingFailure(error) {

    return {
        type: FETCHING_FAILED,
        payload: error
    }
}

export function fetchingMoreSuccess(messages) {

    return {
        type: FETCHING_MORE_SUCCEDED,
        payload: messages
    }
}

export function fetchingMoreFailure(error) {

    return {
        type: FETCHING_MORE_FAILED,
        payload: error
    }
}

export function messageSaved(message, tempID) {

    return {
        type: SAVED,
        payload: message,
        tempID
    }
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
        type: TYPING_FINISH_PROCESSING,
        delayTime
    };
}

export function typingFinished() {

    return {
        type: TYPING_FINISHED
    };
}