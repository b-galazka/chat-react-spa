import {
    CREATION_REQUESTED,
    CREATION_FAILED,
    CREATION_SUCCEDDED,
    FETCHING_FAILED,
    FETCHING_SUCCEDED,
    TYPING_STARTED,
    TYPING_FINISHED
} from './types/users';

export function createUser({username, password}) {

    return {
        type: CREATION_REQUESTED,
        username,
        password
    };
}

export function creationSuccess() {

    return {
        type: CREATION_SUCCEDDED
    };
}

export function creationFailure(error) {

    return {
        type: CREATION_FAILED,
        payload: error
    };
}

export function fetchingSuccess(users) {

    return {
        type: FETCHING_SUCCEDED,
        payload: users
    }
}

export function fetchingFailure() {

    return {
        type: FETCHING_FAILED
    }
}

export function typingStarted(username) {

    return {
        type: TYPING_STARTED,
        payload: username
    };
}

export function typingFinished(username) {

    return {
        type: TYPING_FINISHED,
        payload: username
    };
}