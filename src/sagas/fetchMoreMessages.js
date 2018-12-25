import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../utils/axios';

import { logout } from '@src/actions/auth';
import { fetchingMoreSuccess, fetchingMoreFailure } from '@src/actions/messages';
import { FETCHING_MORE_REQUESTED } from '@src/actions/types/messages';

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