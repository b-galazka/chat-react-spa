import { put, takeLatest, select, call } from 'redux-saga/effects';

import { clearStore } from 'actions/entireStore';
import { LOGOUT_REQUESTED } from 'actions/types/auth';
import { logoutFailure } from 'actions/auth';
import { socketSelector } from './selectors/socket';
import { finishTyping } from './finishTyping';
import axios from '../utils/axios';

export function *logout() {

    yield call(finishTyping, { delayTime: 0 });

    const socket = yield select(socketSelector);

    if (socket && socket.disconnect) {

        socket.disconnect();
    }

    try {

        yield call(axios.delete, '/auth/sign-out');
        yield put(clearStore());

    } catch (err) {

        yield put(logoutFailure(err));
    }
}

export default function *logoutWatcher() {

    yield takeLatest(LOGOUT_REQUESTED, logout);
}