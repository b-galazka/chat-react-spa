import { put, takeLatest, select, call } from 'redux-saga/effects';

import { clearStore } from 'actions/entireStore';
import { LOGOUT } from 'actions/types/entireStore';
import { socketSelector } from './selectors/socket';
import { finishTyping } from './finishTyping';
import axios from 'shared/axios';

// TODO: add errors catching
export function *logout() {

    yield call(finishTyping, { delayTime: 0 });

    const socket = yield select(socketSelector);

    if (socket && socket.disconnect) {

        socket.disconnect();
    }

    yield put(clearStore());
    yield call(axios.get, '/auth/sign-out');
}

export default function *logoutWatcher() {

    yield takeLatest(LOGOUT, logout);
}