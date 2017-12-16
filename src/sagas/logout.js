import {put, takeLatest, select} from 'redux-saga/effects';
import cookies from 'js-cookie';

import {clearStore} from '../actions/entireStore';
import {LOGOUT} from '../actionsTypes/entireStore';

export function *logout() {

    const socket = yield select(state => state.socket.socket);

    if (socket && socket.disconnect) {

        socket.disconnect();
    }

    cookies.remove('token');

    yield put(clearStore());
}

export default function *logoutWatcher() {

    yield takeLatest(LOGOUT, logout);
}