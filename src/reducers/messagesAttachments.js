import {
    START_ATTACHMENT_UPLOADING,
    ATTACHMENT_UPLOADING_STARTED,
    ATTACHMENT_PART_UPLOADED,
    ATTACHMENT_UPLOADED,
    ATTACHMENT_UPLOADING_ERROR
} from '../actions/types/messagesAttachments';

export default function messagesAttachmentsReducer(state, action) {

    const { payload } = action;

    switch (action.type) {

        case START_ATTACHMENT_UPLOADING: {

            return {
                ...state,
                sending: [...state.sending, payload]
            };
        }

        case ATTACHMENT_UPLOADING_STARTED: {

            const { tempId, uploadId } = payload;
            const { sending } = state;

            const sendingMessages = sending.map(message =>
                (message.tempId === tempId) ?
                    { ...message, uploadId } :
                    message
            );

            return {
                ...state,
                sending: sendingMessages
            };
        }

        case ATTACHMENT_PART_UPLOADED: {

            const { uploadId, uploadedBytes } = payload;
            const { sending } = state;

            const sendingMessages = sending.map((message) => {

                const { attachment } = message;

                if (!attachment || message.uploadId !== uploadId) {

                    return message;
                }

                return {
                    ...message,

                    attachment: {
                        ...attachment,
                        uploadedBytes
                    }
                };
            });

            return {
                ...state,
                sending: sendingMessages
            };
        }

        case ATTACHMENT_UPLOADED: {

            const { uploadId, message } = payload;
            const { sent, sending } = state;

            // prevents doubling messages sent during reconnection
            const doesMessageExist = sent.some(
                existingMessage => existingMessage.id === message.id
            );

            return {
                ...state,
                sending: sending.filter(message => message.uploadId !== uploadId),
                sent: (doesMessageExist) ? sent : [...sent, message]
            };
        }

        case ATTACHMENT_UPLOADING_ERROR: {

            const { uploadId, tempId, errorMessage } = payload;
            const { sending } = state;

            const sendingMessages = sending.map((message) => {

                const { attachment } = message;

                if (
                    !attachment ||
                    uploadId && message.uploadId !== uploadId ||
                    !uploadId && message.tempId !== tempId
                ) {

                    return message;
                }

                return {
                    ...message,

                    attachment: {
                        ...attachment,
                        uploadingError: errorMessage
                    }
                };
            });

            return {
                ...state,
                sending: sendingMessages
            };
        }

        default: {

            return state;
        }
    }
}