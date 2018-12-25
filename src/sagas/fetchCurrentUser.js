import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../utils/axios';

import { fetchingCurrentUserFailure, fetchingCurrentUserSuccess } from '@src/actions/auth';
import { FETCHING_CURRENT_USER_REQUESTED } from '@src/actions/types/auth';

function *fetchCurrentUser() {

    try {

        const { data } = yield call(axios.get, '/users/me');

        yield put(fetchingCurrentUserSuccess(data.user || null));

    } catch (err) {

        const { response } = err;

        if (response && (response.status === 401 || response.status === 403)) {

            return yield put(fetchingCurrentUserSuccess(null));
        }

        yield put(fetchingCurrentUserFailure(err));
    }
}

export default function *fetchCurrentUserWatcher() {

    yield takeLatest(FETCHING_CURRENT_USER_REQUESTED, fetchCurrentUser);
}