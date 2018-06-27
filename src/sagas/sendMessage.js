import { takeEvery, select } from 'redux-saga/effects';

import { SEND, SEND_AGAIN } from '../actions/types/messages';
import { socketSelector } from './selectors/socket';

function *sendMessage({ payload }) {

    const socket = yield select(socketSelector);
    const { tempId, content } = payload;

    if (socket && socket.emit) {

        socket.emit('message', {
            content,
            tempId
        });
    }
}

export default function *sendMessageWatcher() {

    yield takeEvery([SEND, SEND_AGAIN], sendMessage);
}