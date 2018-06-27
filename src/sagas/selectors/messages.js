export function uploadingFileSelector(uploadId) {

    return (state) => {

        const message = state.messages.sending.find(
            message => message.uploadId === uploadId
        );

        return message && message.attachment.file;
    };
}