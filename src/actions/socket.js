import {
    INIT, 
    PUT, 
    CONNECTION_FAILED, 
    CONNECTION_SUCCEEDED,
    RECONNECTION_SUCCEEDED,
    RECONNECTION_FAILED,
    DISCONNECTION
} from './types/socket';

export function initSocket() {

    return {
        type: INIT
    };
}

export function putSocket(socket) {

    return {
        type: PUT,
        payload: socket
    };
}

export function connectionFailure() {

    return {
        type: CONNECTION_FAILED
    };
}

export function connectionSuccess() {

    return {
        type: CONNECTION_SUCCEEDED
    };
}

export function reconnectionSuccess() {

    return {
        type: RECONNECTION_SUCCEEDED
    };
}

export function reconnectionFailure() {

    return {
        type: RECONNECTION_FAILED
    };
}

export function disconnection() {

    return {
        type: DISCONNECTION
    };
}