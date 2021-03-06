import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../utils/axios';

import { authSuccess, authFailure } from '@src/actions/auth';
import { AUTH_REQUESTED } from '@src/actions/types/auth';

function *authenticate({ payload }) {

    try {

        const { data } = yield call(axios.post, '/auth/sign-in', payload);

        yield put(authSuccess(data.user));

    } catch (err) {

        yield put(authFailure(err));
    }
}

export default function *authWatcher() {

    yield takeLatest(AUTH_REQUESTED, authenticate);
}