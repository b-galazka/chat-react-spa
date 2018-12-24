import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import prettifyFileSize from 'utils/prettifyFileSize';
import datePropValidator from 'utils/datePropValidator';
import ChatMessageComponent from 'components/abstracts/ChatMessageComponent';
import config from 'shared/config';

import './attachment.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;

    return { username };
}

class Attachment extends ChatMessageComponent {

    render() {

        const {
            username,
            message,
            displayAuthor,
            displayTimeHeader
        } = this.props;

        const { author } = message;

        return (
            <article className={

                classNames({
                    attachment: true,
                    'attachment--my': (username === author.username),
                    'attachment--with-time-header': displayTimeHeader
                })
            }>

                {this.renderTimeHeader()}

                <div className="attachment__data-wrapper">

                    {
                        displayAuthor &&
                        <p className="attachment__author">{author.username}</p>
                    }

                    <div className={

                        classNames({
                            attachment__data: true
                            // 'attachment__data--openable-file': this.isOpenableFile()
                        })
                    }>
                        {this.renderAttachmentData()}

                        <p className="attachment__time">
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
            <p className="attachment__time-header">
                {this.renderTimeHeaderText()}
            </p>
        );
    }

    renderAttachmentData() {

        if (this.isOpenableFile()) {

            // TODO: display file
        }

        const { urls, name, size } = this.props.message.attachment;

        const fileUrl = config.filesHostingUrl + urls.originalFile +
            '?action=download&name=' + encodeURIComponent(name);

        return (
            <p className="attachment__desc">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">{name}</a>{' '}
                ({prettifyFileSize(size)})
            </p>
        );
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

export default connect(mapStateToProps)(Attachment);