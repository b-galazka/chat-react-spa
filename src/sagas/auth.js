import { call, put, takeLatest } from 'redux-saga/effects';
import cookies from 'js-cookie';

import axios from '../shared/axios';

import { authSuccess, authFailure } from 'actions/auth';
import { AUTH_REQUESTED } from 'actions/types/auth';

function *authenticate({ username, password }) {

    try {

        yield call(axios.post, '/auth', { username, password });

        const cookiesUsername = cookies.get('username');

        yield put(authSuccess(cookiesUsername));

    } catch (err) {

        yield put(authFailure(err));
    }
}

export default function *authWatcher() {

    yield takeLatest(AUTH_REQUESTED, authenticate);
}