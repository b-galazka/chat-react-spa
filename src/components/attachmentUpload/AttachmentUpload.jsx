import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import renderText from '../../utils/renderText';

import strings from './strings';

import './attachmentUpload.scss';

function mapDispatchToProps(dispatch) {

    // TODO: add uploadAgain action on unknown errors
    return {};
}

class AttachmentUpload extends Component {

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

        // TODO: render error

        return null;
    }

    static roundBytes(bytes, precision = 2) {

        const multiplier = 10 ** precision;

        return Math.round(bytes * multiplier) / multiplier;
    }
}

AttachmentUpload.propTypes = {

    uploadingError: propTypes.string,
    uploadedBytes: propTypes.number.isRequired,
    tempId: propTypes.string.isRequired,

    file: propTypes.shape({
        name: propTypes.string.isRequired,
        size: propTypes.number.isRequired
    }).isRequired
};

AttachmentUpload.defaultProps = {
    uploadingError: null
};

export default connect(null, mapDispatchToProps)(AttachmentUpload);