import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import renderText from 'utils/renderText';
import { uploadAttachmentAgain } from 'actions/messagesAttachments';

import strings from './strings';

import './attachmentUpload.scss';

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
            <article className="attachment attachment--upload">
                <div className="attachment__data-wrapper">
                    <div className="attachment__data">
                        <div
                            className="attachment__progress-bar"
                            style={{ width: uploadProgress }}
                        >
                        </div>

                        <p className="attachment__desc">
                            {this.renderDescription()}
                        </p>
                    </div>

                    {this.renderSendingError()}
                </div>
            </article>
        );
    }

    renderDescription() {

        const { uploadedBytes, file } = this.props;
        const kilobyte = 1024;
        const megabyte = kilobyte ** 2;
        const gigabyte = kilobyte ** 3;

        let uploadedSize = uploadedBytes;
        let totalSize = file.size;
        let sizeUnit = 'B';

        if (file.size >= gigabyte) {

            uploadedSize = uploadedBytes / gigabyte;
            totalSize = file.size / gigabyte;
            sizeUnit = 'GB';

        } else if (file.size >= megabyte) {

            uploadedSize = uploadedBytes / megabyte;
            totalSize = file.size / megabyte;
            sizeUnit = 'MB';

        } else if (file.size >= kilobyte) {

            uploadedSize = uploadedBytes / kilobyte;
            totalSize = file.size / kilobyte;
            sizeUnit = 'KB';
        }

        return renderText(strings.description, {
            fileName: file.name,
            uploadedSize: `${AttachmentUpload.roundBytes(uploadedSize)} ${sizeUnit}`,
            totalSize: `${AttachmentUpload.roundBytes(totalSize)} ${sizeUnit}`
        });
    }

    renderSendingError() {

        const { uploadingError } = this.props;

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
                className={
                    'attachment__uploading-error ' +
                    'attachment__uploading-error--clickable'
                }
            >
                {strings.unknownError}
            </p>
        );
    }

    getValidationError() {

        const { uploadingError } = this.props;

        if (uploadingError.includes(
            '"name" length must be less than or equal to 255 characters long'
        )) {

            return strings.fileNameLengthError;

        } else if (uploadingError.includes(
            '"type" length must be less than or equal to 255 characters long'
        )) {

            return strings.fileTypeError;

        } else if (uploadingError.includes(
            '"file size" must be less than or equal to 10485760'
        )) {

            return strings.fileSizeMaxError;

        } else if (uploadingError.includes(
            '"file size" must be larger than or equal to 1'
        )) {

            return strings.fileSizeMinError;
        }
    }

    static roundBytes(bytes, precision = 2) {

        const multiplier = 10 ** precision;

        return Math.round(bytes * multiplier) / multiplier;
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
    uploadAttachmentAgain: propTypes.func.isRequired
};

AttachmentUpload.defaultProps = {
    uploadingError: null
};

export default connect(null, mapDispatchToProps)(AttachmentUpload);