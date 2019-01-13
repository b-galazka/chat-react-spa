import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import prettifyFileSize from '@src/utils/prettifyFileSize';
import datePropValidator from '@src/utils/datePropValidator';
import ChatMessageComponent from '@src/components/abstracts/ChatMessageComponent';
import config from '@src/config';

import ImagePreview from './imagePreview/ImagePreview';

import chatSharedStyles from '../shared.scss';
import styles from './attachment.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;

    return { username };
}

/* eslint no-useless-constructor: 0 */
class Attachment extends ChatMessageComponent {

    constructor(props) {

        super(props);
    }

    render() {

        const {
            username,
            message,
            displayAuthor,
            displayTimeHeader
        } = this.props;

        const { author } = message;
        const isMyMessage = (username === author.username);

        return (
            <article
                className={

                    classNames({
                        [chatSharedStyles.attachment]: true,
                        [chatSharedStyles.attachmentMy]: isMyMessage,
                        [styles.attachmentMy]: isMyMessage,
                        [chatSharedStyles.attachmentWithTimeHeader]: displayTimeHeader
                    })
                }
            >

                {this.renderTimeHeader()}

                <div className={chatSharedStyles.attachmentDataWrapper}>

                    {
                        displayAuthor &&
                        <p className={chatSharedStyles.attachmentAuthor}>{author.username}</p>
                    }

                    <div
                        className={

                            classNames({
                                [chatSharedStyles.attachmentData]: true,
                                [styles.attachmentData]: true,
                                [styles.attachmentDataOpenableFile]: this.isOpenableFile()
                            })
                        }
                    >
                        {this.renderAttachmentData()}

                        <p
                            className={classNames(
                                chatSharedStyles.attachmentTime,
                                styles.attachmentTime
                            )}
                        >
                            {this.renderMessageTimeText()}
                        </p>
                    </div>
                </div>
            </article>
        );
    }

    componentDidMount() {

        this.setRefreshingInterval();
    }

    componentWillUnmount() {

        this.clearRefreshingInterval();
    }

    renderTimeHeader() {

        const { displayTimeHeader } = this.props;

        if (!displayTimeHeader) {

            return null;
        }

        return (
            <p className={chatSharedStyles.attachmentTimeHeader}>
                {this.renderTimeHeaderText()}
            </p>
        );
    }

    renderAttachmentData() {

        if (this.isOpenableFile()) {

            return this.renderOpenableFile();
        }

        const { urls, name, size } = this.props.message.attachment;

        const fileUrl = config.filesHostingUrl + urls.originalFile +
            '?action=download&name=' + encodeURIComponent(name);

        return (
            <p className={chatSharedStyles.attachmentDesc}>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">{name}</a>{' '}
                ({prettifyFileSize(size)})
            </p>
        );
    }

    renderOpenableFile() {

        const { message } = this.props;
        const { type, name, size, urls } = message.attachment;

        if (type.startsWith('image/')) {

            return (
                <ImagePreview
                    filename={name}
                    size={size}
                    previewUrl={config.filesHostingUrl + urls.preview}
                    originalFileUrl={config.filesHostingUrl + urls.originalFile}
                    author={message.author}
                />
            );
        }

        return null;
    }

    isOpenableFile() {

        const { type } = this.props.message.attachment;

        return (
            type.startsWith('image/') ||
            type.startsWith('audio/') ||
            type.startsWith('video/')
        );
    }
}

Attachment.propTypes = {
    displayAuthor: propTypes.bool,
    displayTimeHeader: propTypes.bool,

    message: propTypes.shape({

        author: propTypes.shape({
            username: propTypes.string.isRequired
        }).isRequired,

        date: datePropValidator('message.date validation error'),

        attachment: propTypes.shape({
            urls: propTypes.shape({
                originalFile: propTypes.string.isRequired,
                icon: propTypes.string,
                preview: propTypes.string
            }).isRequired,

            name: propTypes.string.isRequired,
            size: propTypes.number.isRequired,
            type: propTypes.string.isRequired
        }).isRequired

    }).isRequired,

    // redux
    username: propTypes.string.isRequired
};

Attachment.defaultProps = {
    displayAuthor: false,
    displayTimeHeader: false
};

export default compose(withNamespaces(), connect(mapStateToProps))(Attachment);