import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import classNames from 'classnames';

import MessageContent from '../messageContent/MessageContent';

import strings from './strings';
import timeUnits from '../../shared/timeUnitsInMs';

import './message.scss';

function mapStateToProps(state) {

    const { username } = state.auth.tokenData;

    return { username };
}

class Message extends Component {

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

            return `${diff} ${(diff > 1) ? strings.minutesAgo : strings.minuteAgo }`;
        } else if (timeDiff < day) {

            const diff = Math.floor(timeDiff / hour);

            return `${diff} ${(diff > 1) ? strings.hoursAgo : strings.hourAgo}`;
        } else if (timeDiff < day * 7) {

            const diff = Math.floor(timeDiff / day);

            return `${diff} ${(diff > 1) ? strings.daysAgo : strings.dayAgo}`;
        } else {

            const date = messageDate.toLocaleDateString();
            const time = messageDate.toLocaleTimeString();

            return `${date} ${time}`;
        }    
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

    clearRefreshingInterval() {

        clearInterval(this.refreshingIntervalId);
    }
}

Message.propTypes = {

    message: propTypes.shape({
        id: propTypes.number,

        author: propTypes.shape({
            username: propTypes.string
        }),

        content: propTypes.string.isRequired,
        date: propTypes.string
    }).isRequired,

    displayAuthor: propTypes.bool,
    displayTimeHeader: propTypes.bool,
    sending: propTypes.bool,

    // redux
    username: propTypes.string.isRequired
};

Message.defaultProps = {
    displayAuthor: false,
    displayTimeHeader: false,
    sending: false
};

export default connect(mapStateToProps)(Message);