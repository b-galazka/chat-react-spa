import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../shared/axios';

import { logout} from 'actions/auth';
import { fetchingSuccess, fetchingFailure } from 'actions/messages';
import { FETCHING_REQUESTED } from 'actions/types/messages';

import config from '../shared/config';

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