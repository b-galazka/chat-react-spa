import { Component } from 'react';
import propTypes from 'prop-types';

import datePropValidator from 'utils/datePropValidator';
import timeUnits from 'utils/timeUnitsInMs';

class ChatMessageComponent extends Component {

    constructor(props) {

        super(props);

        if (this.constructor === ChatMessageComponent) {

            throw new Error('Cannot create instance of abstract ChatMessageComponent class');
        }
    }

    renderTimeHeaderText() {

        const { message, t } = this.props;
        const { minute, hour, day } = timeUnits;

        const messageDate = new Date(message.date);
        const messageTime = messageDate.getTime();
        const timeDiff = Date.now() - messageTime;

        if (timeDiff < minute) {

            return t('message.lessThanMinuteAgo');

        } else if (timeDiff < hour) {

            const diff = Math.floor(timeDiff / minute);

            return t(`message.${(diff > 1) ? 'minutesAgo' : 'minuteAgo'}`, { minutes: diff });

        } else if (timeDiff < day) {

            const diff = Math.floor(timeDiff / hour);

            return t(`message.${(diff > 1) ? 'hoursAgo' : 'hourAgo'}`, { hours: diff });

        } else if (timeDiff < day * 7) {

            const diff = Math.floor(timeDiff / day);

            return t(`message.${(diff > 1) ? 'daysAgo' : 'dayAgo'}`, { days: diff });
        }

        const date = messageDate.toLocaleDateString();
        const time = messageDate.toLocaleTimeString();

        return `${date} ${time}`;
    }

    renderMessageTimeText() {

        const { message, t } = this.props;
        const { day } = timeUnits;

        const messageDate = new Date(message.date);
        const messageTime = messageDate.getTime();
        const timeDiff = Date.now() - messageTime;

        if (timeDiff < day) {

            return messageDate.toLocaleTimeString();

        } else if (timeDiff < 2 * day) {

            return `${t('message.yesterday')} ${messageDate.toLocaleTimeString()}`;

        } else if (timeDiff < 7 * day) {

            const days = t('days', { returnObjects: true });
            const day = days[messageDate.getDay()];

            return `${day} ${messageDate.toLocaleTimeString()}`;

        }

        return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString()}`;
    }

    setRefreshingInterval() {

        const { day, minute } = timeUnits;
        const { displayTimeHeader, message } = this.props;
        const messageTime = new Date(message.date).getTime();
        const timeDiff = Date.now() - messageTime;

        if (!displayTimeHeader || timeDiff >= 7 * day) {

            return;
        }

        this.refreshingIntervalId = setInterval(() => this.forceUpdate(), minute);
    }

    clearRefreshingInterval() {

        clearInterval(this.refreshingIntervalId);
    }
}

ChatMessageComponent.propTypes = {
    message: propTypes.shape({
        date: datePropValidator('messate.date validation error')
    }).isRequired,

    displayTimeHeader: propTypes.bool.isRequired,

    // i18n
    t: propTypes.func.isRequired
};

export default ChatMessageComponent;