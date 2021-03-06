import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../utils/axios';

import { logout } from '@src/actions/auth';
import { fetchingSuccess, fetchingFailure } from '@src/actions/messages';
import { FETCHING_REQUESTED } from '@src/actions/types/messages';

import config from '../config';

function *fetchMessages() {

    const requestConfig = {
        params: { limit: config.messagesPerFirstRequest }
    };

    try {

        const response = yield call(axios.get, '/messages', requestConfig);

        yield put(fetchingSuccess(response.data));

    } catch (err) {

        const { response } = err;

        yield put(fetchingFailure(err));

        if (response && response.status === 401) {

            yield put(logout());
        }
    }
}

export default function *fetchMessagesWatcher() {

    yield takeLatest(FETCHING_REQUESTED, fetchMessages);
}