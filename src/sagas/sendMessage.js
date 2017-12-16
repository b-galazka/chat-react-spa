import {takeEvery, select} from 'redux-saga/effects';

import {SEND} from '../actionsTypes/messages';

function *sendMessage({payload}) {

    const socket = yield select(state => state.socket.socket);

    socket.emit('message', payload);
}

export default function *sendMessageWatcher() {

    yield takeEvery(SEND, sendMessage);
}