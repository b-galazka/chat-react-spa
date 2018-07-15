export function uploadingFileSelector(uploadId) {

    return (state) => {

        const message = state.messages.sending.find(
            message => message.uploadId === uploadId
        );

        return message && message.attachment.file;
    };
}

export function typingStatusSelector(state) {

    return state.messages.typingMessage;
}