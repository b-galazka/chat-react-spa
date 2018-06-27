import { takeEvery, select } from 'redux-saga/effects';

import { START_FILE_UPLOADING } from '../actions/types/messages';
import { socketSelector } from './selectors/socket';

function *startFileUploading({ payload }) {

    const socket = yield select(socketSelector);

    if (socket && socket.emit) {

        const { tempId } = payload;
        const { name, size, type } = payload.attachment.file;

        socket.emit('start file upload', {
            tempId,
            fileInfo: { name, size, type }
        });
    }
}

export default function *startFileUploadingWatcher() {

    yield takeEvery(START_FILE_UPLOADING, startFileUploading);
}