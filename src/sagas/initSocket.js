import { eventChannel, END } from 'redux-saga';
import { put, takeLatest, select, take, call } from 'redux-saga/effects';
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
    fetchingSuccess as fetchingUsersSuccess,
    typingStarted as userStartedTyping,
    typingFinished as userFinishedTyping
} from '../actions/users';

import {
    fetchMessages,
    messageSaved,
    receiveMessage,
    fileUploadedStarted,
    filePartUploaded,
    fileUploaded
} from '../actions/messages';

import { logout } from '../actions/entireStore';
import { INIT } from '../actions/types/socket';
import { tokenSelector } from './selectors/auth';
import { socketSelector } from './selectors/socket';

import config from '../shared/config';

function getSocketChannel(socket) {

    return eventChannel((emit) => {

        socket.on('error', (error) => {

            if (error === 'invalid token or no token provided') {

                emit(logout());
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

        socket.on('message saved', ({ message, tempId }) => {
            
            emit(messageSaved(message, tempId));
        });

        socket.on('message', (message) => {

            emit(receiveMessage(message));
        });

        socket.on('message sending error', ({ tempId }) => {

            // TODO: handle message sending error
        });

        socket.on('typing started', (username) => {

            emit(userStartedTyping(username));
        });

        socket.on('typing finished', (username) => {

            emit(userFinishedTyping(username));
        });

        socket.on('file upload started', ({ tempId, uploadId }) => {

            emit(fileUploadedStarted(tempId, uploadId));
        });

        socket.on('file part uploaded', ({ uploadId, uploadedBytes }) => {

            emit(filePartUploaded(uploadId, uploadedBytes));
        });

        socket.on('file uploaded', ({ uploadId, message }) => {

            emit(fileUploaded(uploadId, message));
        });

        socket.on('file info validation error', ({ tempId, message }) => {

            // TODO: handle error
        });

        socket.on('file upload timeout', ({ tempId }) => {

            // TODO: handle timeout
        });

        socket.on('uploading file error', ({ tempId, message }) => {

            // TODO: handle timeout
        });

        return () => {

            emit(false);
        };
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

    let socket = yield select(socketSelector);

    if (socket) {

        return;
    }

    const token = yield select(tokenSelector);

    const socketConfig = {
        query: { token },
        reconnectionAttempts: config.socketReconnectionsAmount
    };

    socket = io.connect(config.socketUrl, socketConfig);

    yield put(putSocket(socket));
    yield call(listenForSocketEvents, socket);
}

export default function *initSocketWatcher() {

    yield takeLatest(INIT, initSocket);
}