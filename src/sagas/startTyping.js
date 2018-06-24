import { select, takeLatest } from 'redux-saga/effects';

import { socketSelector } from './selectors/socket';
import { TYPING_STARTED } from '../actions/types/messages';

function *startTyping() {

    const socket = yield select(socketSelector);

    if (socket && socket.emit) {

        socket.emit('typing started');
    }
}

export default function *startTypingWatcher() {

    yield takeLatest(TYPING_STARTED, startTyping);
}