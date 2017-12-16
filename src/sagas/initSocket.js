import {eventChannel, END} from 'redux-saga';
import {put, takeLatest, select, take, call} from 'redux-saga/effects';
import io from 'socket.io-client';

import {
    putSocket, 
    connectionFailure, 
    connectionSuccess,
    reconnectionSuccess,
    reconnectionFailure,
    disconnection
} from '../actions/socket';

import {
    fetchingFailure as fetchingUsersFailure,
    fetchingSuccess as fetchingUsersSuccess
} from '../actions/users';

import {logout} from '../actions/entireStore';
import {fetchMessages, messageSaved, receiveMessage} from '../actions/messages';
import {INIT} from '../actionsTypes/socket';

import config from '../shared/config';

function getSocketChannel(socket) {

    return eventChannel((emit) => {

        socket.on('error', (error) => {

            if (error === 'invalid token or no token provided') {

                emit(logout());
                emit(false);
                emit(END);
            } else {

                emit(connectionFailure());
            }
        });

        socket.on('connect', () => {

            emit(connectionSuccess());
        });

        socket.on('reconnect', () => {

            emit(reconnectionSuccess());
            emit(fetchMessages());
        });

        socket.on('reconnect_failed', () => {

            emit(reconnectionFailure());
        });

        socket.on('disconnect', (reason) => {

            if (reason === 'io client disconnect') {

                emit(false);
                emit(END);
            } else {

                emit(disconnection());
            }
        });

        socket.on('users', (users) => {

            emit(fetchingUsersSuccess(users));
        });

        socket.on('users error', () => {

            emit(fetchingUsersFailure());
        });

        socket.on('expired token', () => {

            emit(logout());
        });

        socket.on('message saved', ({message, tempID}) => {
            
            emit(messageSaved(message, tempID));
        });

        socket.on('message', (message) => {

            emit(receiveMessage(message));
        });

        return () => {};
    });
}

function *listenForSocketEvents(socket) {

    const channel = getSocketChannel(socket);

    let action = yield take(channel);

    while (action !== false) {

        yield put(action);

        action = yield take(channel);
    }
} 

function *initSocket() {

    let socket = yield select(state => state.socket.socket);

    if (socket) {

        return;
    }

    const token = yield select(state => state.auth.token);

    const socketConfig = {
        query: {token},
        reconnectionAttempts: config.socketReconnectionsAmount
    };

    socket = io.connect(config.socketUrl, socketConfig);

    yield put(putSocket(socket));
    yield call(listenForSocketEvents, socket);
}

export default function *initSocketWatcher() {

    yield takeLatest(INIT, initSocket);
}