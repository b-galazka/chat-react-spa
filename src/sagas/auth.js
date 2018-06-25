import { call, put, takeLatest } from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';
import cookies from 'js-cookie';

import axios from '../shared/axios';

import { authSuccess, authFailure } from '../actions/auth';
import { AUTH_REQUESTED } from '../actions/types/auth';

function *authenticate({ username, password }) {

    try {

        const response = yield call(axios.post, '/auth', { username, password });

        const {token} = response.data;
        const tokenData = jwtDecode(token);

        cookies.set('token', token);

        yield put(authSuccess(token, tokenData));
    } catch (err) {

        yield put(authFailure(err));
    }
}

export default function *authWatcher() {

    yield takeLatest(AUTH_REQUESTED, authenticate);
}