import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';

import MessageContent from './messageContent/MessageContent';

import { sendMessageAgain } from '@src/actions/messages';
import ChatMessageComponent from '@src/components/abstracts/ChatMessageComponent';
import datePropValidator from '@src/utils/datePropValidator';

import chatSharedStyles from '../shared.scss';
import styles from './message.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;

    return { username };
}

function mapDispatchToProps(dispatch) {

    return {
        sendMessageAgain: bindActionCreators(sendMessageAgain, dispatch)
    };
}

class Message extends ChatMessageComponent {

    constructor(props) {

        super(props);

        this.sendMessage = this.sendMessage.bind(this);
    }

    render() {

        const {
            sending,
            username,
            message,
            displayAuthor,
            displayTimeHeader
        } = this.props;

        const messageAuthor = message.author && message.author.username;

        return (
            <article
                className={

                    classNames({
                        [chatSharedStyles.message]: true,
                        [styles.messageSending]: sending,
                        [styles.messageSent]: !sending,
                        [chatSharedStyles.messageMy]: (username === messageAuthor || sending),
                        [chatSharedStyles.messageWithTimeHeader]: displayTimeHeader
                    })
                }
            >

                {this.renderTimeHeader()}

                <div className={chatSharedStyles.messageDataWrapper}>

                    {
                        displayAuthor &&
                        <p className={chatSharedStyles.messageAuthor}>{messageAuthor}</p>
                    }

                    <div className={classNames(chatSharedStyles.messageData, styles.messageData)}>
                        <p className={chatSharedStyles.messageContent}>
                            <MessageContent>{message.content}</MessageContent>
                        </p>

                        {this.renderMessageTime()}
                    </div>

                    {this.renderSendingError()}
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
            <p className={chatSharedStyles.messageTimeHeader}>
                {this.renderTimeHeaderText()}
            </p>
        );
    }

    renderMessageTime() {

        const { sending } = this.props;

        if (sending) {

            return null;
        }

        return (
            <p className={classNames(chatSharedStyles.messageTime, styles.messageTime)}>
                {this.renderMessageTimeText()}
            </p>
        );
    }

    renderSendingError() {

        const { sendingError, t } = this.props;

        if (!sendingError) {

            return null;
        }

        return (
            <p className={chatSharedStyles.messageSendingError} onClick={this.sendMessage}>
                {t('message.sendingError')}
            </p>
        );
    }

    sendMessage() {

        const { message, sendMessageAgain } = this.props;

        sendMessageAgain(message);
    }
}

Message.propTypes = {

    message: propTypes.shape({
        content: propTypes.string.isRequired,
        tempId: propTypes.string,
        date: datePropValidator('message.date validation error'),
        author: propTypes.shape({ username: propTypes.string })
    }).isRequired,

    sendingError(props, propName) {

        const { sending } = props;
        const sendingError = props[propName];

        if (sending && Boolean(sendingError) !== sendingError) {

            return new Error('props.sendingError validation error');
        }

        if (!sending && sendingError !== null && sendingError !== undefined) {

            return new Error(
                'props.sendingError can be provided only to message which is being sent'
            );
        }
    },

    displayAuthor: propTypes.bool,
    displayTimeHeader: propTypes.bool,
    sending: propTypes.bool,

    // redux
    username: propTypes.string.isRequired,
    sendMessageAgain: propTypes.func.isRequired,

    // i18n
    t: propTypes.func.isRequired
};

Message.defaultProps = {
    displayAuthor: false,
    displayTimeHeader: false,
    sending: false
};

export default compose(withNamespaces(), connect(mapStateToProps, mapDispatchToProps))(Message);