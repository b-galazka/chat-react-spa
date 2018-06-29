import { takeEvery, select, call, put } from 'redux-saga/effects';

import {
    ATTACHMENT_UPLOADING_STARTED,
    ATTACHMENT_PART_UPLOADED
} from '../actions/types/messagesAttachments';

import { attachmentUploadingError } from '../actions/messagesAttachments';
import { uploadingFileSelector } from './selectors/messages';
import { socketSelector } from './selectors/socket';
import getFileBinaryData from '../utils/getFileBinaryData';
import { uploadFilePartSize } from '../shared/config';

function *uploadFilePart({ payload }) {

    const { uploadId, uploadedBytes } = payload;

    try {

        const file = yield select(uploadingFileSelector(uploadId));
        const socket = yield select(socketSelector);

        const filePart = file.slice(uploadedBytes, uploadedBytes + uploadFilePartSize);

        const binaryData = yield call(getFileBinaryData, filePart);

        socket.emit('upload file part', { id: uploadId, data: binaryData });

    } catch (err) {

        yield put(attachmentUploadingError({ uploadId, errorMessage: 'FileReader error' }));
    }
}

export default function *uploadFilePartWatcher() {

    yield takeEvery(
        [ATTACHMENT_UPLOADING_STARTED, ATTACHMENT_PART_UPLOADED],
        uploadFilePart
    );
}