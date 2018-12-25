import { call, put, takeLatest } from 'redux-saga/effects';

import axios from '../utils/axios';

import { creationSuccess, creationFailure } from 'actions/users';
import { CREATION_REQUESTED } from 'actions/types/users';

function *createUser({ username, password }) {

    try {

        yield call(axios.post, '/users', { username, password });

        yield put(creationSuccess());
    } catch (err) {

        yield put(creationFailure(err));
    }
}

export default function *createUserWatcher() {

    yield takeLatest(CREATION_REQUESTED, createUser);
}