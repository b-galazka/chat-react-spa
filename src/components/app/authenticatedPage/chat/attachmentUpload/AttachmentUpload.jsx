import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import prettifyFileSize from '@src/utils/prettifyFileSize';
import { uploadAttachmentAgain } from '@src/actions/messagesAttachments';

import chatSharedStyles from '../shared.scss';
import styles from './attachmentUpload.scss';

function mapDispatchToProps(dispatch) {

    return {
        uploadAttachmentAgain: bindActionCreators(uploadAttachmentAgain, dispatch)
    };
}

class AttachmentUpload extends Component {

    constructor() {

        super();

        this.uploadAttachment = this.uploadAttachment.bind(this);
    }

    render() {

        const { uploadedBytes, file } = this.props;
        const uploadProgress = `${uploadedBytes / file.size * 100}%`;

        return (
            <article
                className={classNames(
                    chatSharedStyles.attachment,
                    chatSharedStyles.attachmentMy
                )}
            >
                <div className={chatSharedStyles.attachmentDataWrapper}>
                    <div
                        className={classNames(
                            chatSharedStyles.attachmentUploadData,
                            styles.attachmentUploadData
                        )}
                    >
                        <div
                            className={styles.attachmentUploadProgressBar}
                            style={{ width: uploadProgress }}
                        >
                        </div>

                        <p className={chatSharedStyles.attachmentDesc}>
                            {this.renderDescription()}
                        </p>
                    </div>

                    {this.renderSendingError()}
                </div>
            </article>
        );
    }

    renderDescription() {

        const { uploadedBytes, file, t } = this.props;

        return t('attachmentUpload.description', {
            fileName: file.name,
            uploadedSize: prettifyFileSize(uploadedBytes),
            totalSize: prettifyFileSize(file.size)
        });
    }

    renderSendingError() {

        const { uploadingError, t } = this.props;

        if (uploadingError === null) {

            return null;
        }

        const validationError = this.getValidationError();

        if (validationError) {

            return <p className="attachment__uploading-error">{validationError}</p>;
        }

        return (
            <p
                onClick={this.uploadAttachment}

                className={classNames(
                    chatSharedStyles.attachmentUploadingError,
                    chatSharedStyles.attachmentUploadingErrorClickable
                )}
            >
                {t('attachmentUpload.unknownError')}
            </p>
        );
    }

    getValidationError() {

        const { uploadingError, t } = this.props;

        if (uploadingError.includes(
            '"name" length must be less than or equal to 255 characters long'
        )) {

            return t('attachmentUpload.fileNameLengthError');

        } else if (uploadingError.includes(
            '"type" length must be less than or equal to 255 characters long'
        )) {

            return t('attachmentUpload.fileTypeError');

        } else if (uploadingError.includes(
            '"file size" must be less than or equal to 10485760'
        )) {

            return t('attachmentUpload.fileSizeMaxError');

        } else if (uploadingError.includes(
            '"file size" must be larger than or equal to 1'
        )) {

            return t('attachmentUpload.fileSizeMinError');
        }
    }

    uploadAttachment() {

        const { tempId, file, uploadAttachmentAgain } = this.props;

        uploadAttachmentAgain(tempId, file);
    }
}

AttachmentUpload.propTypes = {

    uploadingError: propTypes.string,
    uploadedBytes: propTypes.number.isRequired,
    tempId: propTypes.string.isRequired,

    file: propTypes.shape({
        name: propTypes.string.isRequired,
        size: propTypes.number.isRequired,
        type: propTypes.string.isRequired
    }).isRequired,

    // redux
    uploadAttachmentAgain: propTypes.func.isRequired,

    // i18n
    t: propTypes.func.isRequired
};

AttachmentUpload.defaultProps = {
    uploadingError: null
};

export default compose(withNamespaces(), connect(null, mapDispatchToProps))(AttachmentUpload);