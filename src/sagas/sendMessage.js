import {takeEvery, select} from 'redux-saga/effects';

import {SEND} from '../actionsTypes/messages';
import { socketSelector } from './selectors/socket';

function *sendMessage({payload}) {

    const socket = yield select(socketSelector);

    if (socket && socket.emit) {

        socket.emit('message', payload);
    }
}

export default function *sendMessageWatcher() {

    yield takeEvery(SEND, sendMessage);
}