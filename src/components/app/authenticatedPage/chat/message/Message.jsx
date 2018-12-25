import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';

import { sendMessageAgain } from 'actions/messages';
import MessageContent from './messageContent/MessageContent';
import ChatMessageComponent from 'components/abstracts/ChatMessageComponent';
import datePropValidator from 'utils/datePropValidator';

import './message.scss';

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
                        message: true,
                        'message--sending': sending,
                        'message--sent': !sending,
                        'message--my': (username === messageAuthor || sending),
                        'message--with-time-header': displayTimeHeader
                    })
                }
            >

                {this.renderTimeHeader()}

                <div className="message__data-wrapper">

                    {
                        displayAuthor &&
                        <p className="message__author">{messageAuthor}</p>
                    }

                    <div className="message__data">
                        <p className="message__content">
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
            <p className="message__time-header">
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
            <p className="message__time">
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
            <p className="message__sending-error" onClick={this.sendMessage}>
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