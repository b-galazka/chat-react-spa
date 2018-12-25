import { takeEvery, select } from 'redux-saga/effects';

import {
    START_ATTACHMENT_UPLOADING,
    UPLOAD_ATTACHMENT_AGAIN
} from '@src/actions/types/messagesAttachments';

import { socketSelector } from './selectors/socket';

function *startFileUploading({ payload }) {

    const socket = yield select(socketSelector);
    const { file = payload.attachment.file } = payload;

    if (socket && socket.emit) {

        const { tempId } = payload;
        const { name, size, type } = file;

        socket.emit('start file upload', {
            tempId,
            fileInfo: { name, size, type }
        });
    }
}

export default function *startFileUploadingWatcher() {

    yield takeEvery(
        [START_ATTACHMENT_UPLOADING, UPLOAD_ATTACHMENT_AGAIN],
        startFileUploading
    );
}