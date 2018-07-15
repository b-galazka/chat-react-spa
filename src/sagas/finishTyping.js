import { delay } from 'redux-saga';
import { select, takeLatest, put } from 'redux-saga/effects';

import { socketSelector } from './selectors/socket';
import { typingStatusSelector } from './selectors/messages';
import { typingFinished } from 'actions/messages';
import { TYPING_FINISH_REQUESTED } from 'actions/types/messages';

export function *finishTyping({ delayTime }) {

    if (delayTime > 0) {

        yield delay(delayTime);
    }

    const isUserTyping = yield select(typingStatusSelector);

    if (!isUserTyping) {

        return;
    }

    const socket = yield select(socketSelector);

    if (socket && socket.emit) {

        socket.emit('typing finished');
    }

    yield put(typingFinished());
}

export default function *finishTypingWatcher() {

    yield takeLatest(TYPING_FINISH_REQUESTED, finishTyping);
}