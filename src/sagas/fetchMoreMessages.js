import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../utils/axios';

import { logout } from 'actions/auth';
import { fetchingMoreSuccess, fetchingMoreFailure } from 'actions/messages';
import { FETCHING_MORE_REQUESTED } from 'actions/types/messages';

import config from '../config';

function *fetchMoreMessages({ lastMessageID }) {

    const requestConfig = {

        params: {
            limit: config.messagesPerFirstRequest,
            before: lastMessageID
        }
    };

    try {

        const response = yield call(axios.get, '/messages', requestConfig);

        yield put(fetchingMoreSuccess(response.data));

    } catch (err) {

        const { response } = err;

        yield put(fetchingMoreFailure(err));

        if (response && response.status === 401) {

            yield put(logout());
        }
    }
}

export default function *fetchMoreMessagesWatcher() {

    yield takeLatest(FETCHING_MORE_REQUESTED, fetchMoreMessages);
}