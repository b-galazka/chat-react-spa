import {call, put, takeLatest, select} from 'redux-saga/effects';

import axios from '../shared/axios';

import {logout} from '../actions/entireStore';
import {fetchingSuccess, fetchingFailure} from '../actions/messages';
import {FETCHING_REQUESTED} from '../actionsTypes/messages';

import config from '../shared/config';

function *fetchMessages({lastMessageID}) {

    const token = yield select(state => state.auth.token);

    const requestConfig = {

        headers: {
            Authorization: `Bearer ${token}`
        },

        params: {
            limit: config.messagesPerFirstRequest
        }
    };

    try {

        const response = yield call(axios.get, '/messages', requestConfig);

        yield put(fetchingSuccess(response.data));
    } catch (err) {
        
        const {response} = err;

        yield put(fetchingFailure(err));

        if (response && response.status === 401) {

            yield put(logout());
        }
    }
}

export default function *fetchMessagesWatcher() {

    yield takeLatest(FETCHING_REQUESTED, fetchMessages);
}