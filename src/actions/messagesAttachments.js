import {
    START_ATTACHMENT_UPLOADING,
    ATTACHMENT_UPLOADING_STARTED,
    ATTACHMENT_PART_UPLOADED,
    ATTACHMENT_UPLOADED,
    ATTACHMENT_UPLOADING_ERROR
} from './types/messagesAttachments';

export function startAttachmentUploading(tempId, file) {

    return {

        type: START_ATTACHMENT_UPLOADING,

        payload: {
            tempId,
            uploadId: null,

            attachment: {
                file,
                uploadingError: null,
                uploadedBytes: 0
            }
        }
    };
}

export function attachmentUploadedStarted(tempId, uploadId) {

    return {
        type: ATTACHMENT_UPLOADING_STARTED,
        payload: { tempId, uploadId, uploadedBytes: 0 }
    };
}

export function attachmentPartUploaded(uploadId, uploadedBytes) {

    return {
        type: ATTACHMENT_PART_UPLOADED,
        payload: { uploadId, uploadedBytes }
    };
}

export function attachmentUploaded(uploadId, message) {

    return {
        type: ATTACHMENT_UPLOADED,
        payload: { uploadId, message }
    };
}

export function attachmentUploadingError(payload) {

    return {
        type: ATTACHMENT_UPLOADING_ERROR,
        payload
    };
}