import { all, fork } from 'redux-saga/effects';

import authSaga from './auth';
import creationUserSaga from './createUser';
import fetchingMessagesSaga from './fetchMessages';
import fetchingMoreMessagesSaga from './fetchMoreMessages';
import socketInitializationSaga from './initSocket';
import loggingOutSaga from './logout';
import sendingMessageSaga from './sendMessage';
import startTypingSaga from './startTyping';
import finishTypingSaga from './finishTyping';
import startFileUploadingSaga from './startFileUploading';
import uploadFilePartSaga from './uploadFilePart';
import fetchCurrentUser from './fetchCurrentUser';

export default function *rootSaga() {

    yield all([
        fork(authSaga),
        fork(creationUserSaga),
        fork(fetchingMessagesSaga),
        fork(fetchingMoreMessagesSaga),
        fork(socketInitializationSaga),
        fork(loggingOutSaga),
        fork(sendingMessageSaga),
        fork(startTypingSaga),
        fork(finishTypingSaga),
        fork(startFileUploadingSaga),
        fork(uploadFilePartSaga),
        fork(fetchCurrentUser)
    ]);
}