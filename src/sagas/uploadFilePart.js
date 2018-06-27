import { takeEvery, select, call } from 'redux-saga/effects';

import { FILE_UPLOADING_STARTED, FILE_PART_UPLOADED } from '../actions/types/messages';
import { uploadingFileSelector } from './selectors/messages';
import { socketSelector } from './selectors/socket';
import getFileBinaryData from '../utils/getFileBinaryData';
import { uploadFilePartSize } from '../shared/config';

function *uploadFilePart({ payload }) {

    try {

        const { uploadId, uploadedBytes } = payload;

        const file = yield select(uploadingFileSelector(uploadId));
        const socket = yield select(socketSelector);

        const filePart = file.slice(uploadedBytes, uploadedBytes + uploadFilePartSize);

        const binaryData = yield call(getFileBinaryData, filePart);

        socket.emit('upload file part', { id: uploadId, data: binaryData });

    } catch (err) {

        // TODO: emit error action
    }
}

export default function *uploadFilePartWatcher() {

    yield takeEvery([FILE_UPLOADING_STARTED, FILE_PART_UPLOADED], uploadFilePart);
}