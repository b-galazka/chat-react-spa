import { delay } from 'redux-saga';
import { select, takeLatest, put } from 'redux-saga/effects';

import { socketSelector } from './selectors/socket';
import { typingFinished } from '../actions/messages';
import { TYPING_FINISH_PROCESSING } from '../actionsTypes/messages';

export function* finishTyping({ delayTime }) {

    yield delay(delayTime);

    const socket = yield select(socketSelector);

    if (socket && socket.emit) {

        socket.emit('typing finished');
    }

    yield put(typingFinished());
}

export default function* finishTypingWatcher() {

    yield takeLatest(TYPING_FINISH_PROCESSING, finishTyping);
}