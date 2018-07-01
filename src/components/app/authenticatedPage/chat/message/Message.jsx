import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import classNames from 'classnames';

import { sendMessageAgain } from 'actions/messages';
import MessageContent from './messageContent/MessageContent';

import renderText from 'utils/renderText';

import strings from './strings';
import timeUnits from '../timeUnitsInMs';

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

class Message extends Component {

    constructor() {

        super();

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
            <article className={

                classNames({
                    message: true,
                    'message--sending': sending,
                    'message--sent': !sending,
                    'message--my': (username === messageAuthor || sending),
                    'message--with-time-header': displayTimeHeader
                })
            }>

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

    // TODO: move to abstract class and share it with Attachment component
    componentDidMount() {

        this.setRefreshingInterval();
    }

    // TODO: move to abstract class and share it with Attachment component
    componentWillUnmount() {

        this.clearRefreshingInterval();
    }

    // TODO: move to abstract class and share it with Attachment component
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

    // TODO: move to abstract class and share it with Attachment component
    renderTimeHeaderText() {

        const { message } = this.props;
        const { minute, hour, day } = timeUnits;

        const messageDate = new Date(message.date);
        const messageTime = messageDate.getTime();
        const timeDiff = Date.now() - messageTime;

        if (timeDiff < minute) {

            return strings.lessThanMinuteAgo;

        } else if (timeDiff < hour) {

            const diff = Math.floor(timeDiff / minute);

            return renderText(
                strings[(diff > 1) ? 'minutesAgo' : 'minuteAgo'],
                { minutes: diff }
            );

        } else if (timeDiff < day) {

            const diff = Math.floor(timeDiff / hour);

            return renderText(
                strings[(diff > 1) ? 'hoursAgo' : 'hourAgo'],
                { hours: diff }
            );

        } else if (timeDiff < day * 7) {

            const diff = Math.floor(timeDiff / day);

            return renderText(
                strings[(diff > 1) ? 'daysAgo' : 'dayAgo'],
                { days: diff }
            )

        } else {

            const date = messageDate.toLocaleDateString();
            const time = messageDate.toLocaleTimeString();

            return `${date} ${time}`;
        }    
    }

    // TODO: move to abstract class and share it with Attachment component
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

    // TODO: move to abstract class and share it with Attachment component
    renderMessageTimeText() {

        const { message } = this.props;
        const { day } = timeUnits;

        const messageDate = new Date(message.date);
        const messageTime = messageDate.getTime();
        const timeDiff = Date.now() - messageTime;

        if (timeDiff < day) {

            return messageDate.toLocaleTimeString();
        } else if (timeDiff < 2 * day) {

            return `${strings.yesterday} ${messageDate.toLocaleTimeString()}`;
        } else if (timeDiff < 7 * day) {

            const day = strings.days[messageDate.getDay()];

            return `${day} ${messageDate.toLocaleTimeString()}`;
        } else {

            return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`;
        }
    }

    renderSendingError() {

        const { sendingError } = this.props;

        if (!sendingError) {

            return null;
        }

        return (
            <p
                className="message__sending-error"
                onClick={this.sendMessage}
            >
                {strings.sendingError}
            </p>
        );
    }

    sendMessage() {

        const { message, sendMessageAgain } = this.props;

        sendMessageAgain(message);
    }

    // TODO: move to abstract class and share it with Attachment component
    setRefreshingInterval() {

        const { day, minute } = timeUnits;
        const { displayTimeHeader, message } = this.props;
        const messageTime = new Date(message.date).getTime();
        const timeDiff = Date.now() - messageTime;

        if (!displayTimeHeader || timeDiff >= 7 * day) {

            return;
        }

        this.refreshingIntervalId = setInterval(() => {

            this.forceUpdate();
        }, minute);
    }

    // TODO: move to abstract class and share it with Attachment component
    clearRefreshingInterval() {

        clearInterval(this.refreshingIntervalId);
    }
}

Message.propTypes = {

    message: propTypes.shape({
        content: propTypes.string.isRequired,
        tempId: propTypes.string,

        author: propTypes.shape({
            username: propTypes.string
        }),

        date(props, propName) {

            const propValue = props[propName];

            if (propValue && new Date(propValue).toString() === 'Invalid Date') {

                return new Error('sentMessages[].date validation error');
            }
        }
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
    sendMessageAgain: propTypes.func.isRequired
};

Message.defaultProps = {
    displayAuthor: false,
    displayTimeHeader: false,
    sending: false
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);