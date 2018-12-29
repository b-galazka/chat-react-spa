import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import MessageForm from './messageForm/MessageForm';
import Message from './message/Message';
import LoadingAnimation from '@src/components/utils/loadingAnimation/LoadingAnimation';
import AttachmentUpload from './attachmentUpload/AttachmentUpload';
import Attachment from './attachment/Attachment';
import Fading from '@src/components/utils/fading/Fading';

import { fetchMoreMessages } from '@src/actions/messages';
import datePropValidator from '@src/utils/datePropValidator';
import timeUnits from '@src/utils/timeUnitsInMs';

import styles from './chat.scss';

function mapStateToProps(state) {

    const {
        sending,
        sent,
        fetchedAll,
        fetchingMore,
        fetchingMoreError
    } = state.messages;

    const { username } = state.auth.user;
    const { typingUsers } = state.users;
    const { isMobileSidebarOpened } = state.ui;

    return {
        sendingMessages: sending,
        sentMessages: sent,
        noMoreMessages: fetchedAll,
        fetchingMoreMessages: fetchingMore,
        fetchingMoreMessagesError: fetchingMoreError,
        username,
        typingUsers,
        isMobileSidebarOpened
    };
}

function mapDispatchToProps(dispatch) {

    return {
        fetchMoreMessages: bindActionCreators(fetchMoreMessages, dispatch)
    };
}

class Chat extends Component {

    constructor(props) {

        super();

        const { sentMessages } = props;

        this.firstFetchedMessageID = sentMessages[0] && sentMessages[0].id;
        this.scrollableAreaPrevScrollHeight = 0;
        this.scrollableAreaRef = null;
        this.typingUsersElemRef = null;

        this.fetchMoreMessages = this.fetchMoreMessages.bind(this);
    }

    render() {

        const {
            sendingMessages,
            sentMessages,
            fetchingMoreMessages,
            fetchingMoreMessagesError,
            t,
            isMobileSidebarOpened
        } = this.props;

        return (
            <section className={styles.chat}>
                <section
                    className={styles.chatMessagesArea}
                    ref={(ref) => { this.scrollableAreaRef = ref; }}
                    onScroll={this.fetchMoreMessages}
                >

                    {
                        fetchingMoreMessages &&

                        <figure className={styles.chatFetchingMoreMessagesLoader}>
                            <LoadingAnimation width="50px" height="50px" />
                        </figure>
                    }

                    {
                        fetchingMoreMessagesError &&

                        <p className={styles.chatFetchingMoreMessagesError}>
                            {t('chat.fetchingMoreMessagesError')}
                        </p>
                    }

                    {
                        (sendingMessages.length === 0 && sentMessages.length === 0) &&
                        <p className={styles.chatNoMessages}>{t('chat.noMessages')}</p>
                    }

                    {this.renderSentMessages()}
                    {this.renderSendingMessages()}
                    {this.renderTypingUsers()}
                </section>

                <MessageForm />

                <Fading showChildren={isMobileSidebarOpened} fadingDuration={500}>
                    <div className={styles.chatCover}></div>
                </Fading>
            </section>
        );
    }

    componentDidMount() {

        this.scrollDown();
    }

    componentDidUpdate(prevProps) {

        if (this.areOlderMessagesFetched()) {

            this.scrollToTheLastPosition();
            this.firstFetchedMessageID = this.props.sentMessages[0].id;

        } else if (this.shouldScrollDown(prevProps)) {

            this.scrollDown();
        }
    }

    componentWillUpdate(nextProps) {

        this.onOlderMessagesFetching(nextProps);
    }

    renderSentMessages() {

        const { sentMessages } = this.props;

        return sentMessages.map((message, index) => {

            const shouldDisplayTimeHeader = this.shouldDisplayTimeHeader(index);

            const shouldDisplayAuthor = this.shouldDisplayAuthor(
                index,
                shouldDisplayTimeHeader
            );

            if (message.attachment) {

                return (
                    <Attachment
                        key={message.id}
                        message={message}
                        displayAuthor={shouldDisplayAuthor}
                        displayTimeHeader={shouldDisplayTimeHeader}
                    />
                );
            }

            return (
                <Message
                    key={message.id}
                    message={message}
                    displayAuthor={shouldDisplayAuthor}
                    displayTimeHeader={shouldDisplayTimeHeader}
                />
            );
        });
    }

    renderSendingMessages() {

        const { sendingMessages } = this.props;

        return sendingMessages.map((message) => {

            const { tempId, sendingError, attachment } = message;

            if (attachment) {

                const { file, uploadingError, uploadedBytes } = attachment;

                return (
                    <AttachmentUpload
                        key={tempId}
                        tempId={tempId}
                        file={file}
                        uploadingError={uploadingError}
                        uploadedBytes={uploadedBytes}
                    />
                );
            }

            return (
                <Message
                    key={tempId}
                    message={message}
                    sendingError={sendingError}
                    sending
                />
            );
        });
    }

    renderTypingUsers() {

        const { typingUsers, t } = this.props;

        if (typingUsers.length === 0) {

            this.typingUsersElemRef = null;

            return null;
        }

        const text = (typingUsers.length === 1) ?

            t('chat.singlePersonTyping', { username: typingUsers[0] }) :

            t('chat.multiplePersonsTyping', {
                usernames: typingUsers.slice(0, -1).join(', '),
                lastUsername: typingUsers[typingUsers.length - 1]
            });

        return (
            <p ref={(ref) => { this.typingUsersElemRef = ref; }} className={styles.chatTypingUsers}>
                {text}
            </p>
        );
    }

    shouldDisplayTimeHeader(messageIndex) {

        const { hour } = timeUnits;
        const { sentMessages } = this.props;
        const message = sentMessages[messageIndex];
        const prevMessage = sentMessages[messageIndex - 1];

        if (!prevMessage) {

            return true;
        }

        const messageTime = new Date(message.date).getTime();
        const prevMessageTime = new Date(prevMessage.date).getTime();
        const timeDiff = messageTime - prevMessageTime;

        return (timeDiff > hour);
    }

    shouldDisplayAuthor(messageIndex, timeHeader) {

        const { username, sentMessages } = this.props;
        const message = sentMessages[messageIndex];
        const prevMessage = sentMessages[messageIndex - 1];
        const messageAuthor = message.author.username;
        const prevMessageAuthor = prevMessage && prevMessage.author.username;

        return Boolean(
            (!prevMessage || messageAuthor !== prevMessageAuthor || timeHeader) &&
            username !== messageAuthor
        );
    }

    scrollDown() {

        const { scrollableAreaRef } = this;

        scrollableAreaRef.scrollTop = scrollableAreaRef.scrollHeight;
    }

    shouldScrollDown(prevProps) {

        const { typingUsersElemRef } = this;
        const { scrollHeight, scrollTop, clientHeight } = this.scrollableAreaRef;
        const typingUsersElemHeight = typingUsersElemRef ? typingUsersElemRef.clientHeight : 0;
        const scrollBottom = scrollHeight - scrollTop - clientHeight - typingUsersElemHeight;

        const areNewMessages = prevProps.sentMessages.length !== this.props.sentMessages.length;
        const typingUsersChange = prevProps.typingUsers !== this.props.typingUsers;

        return (scrollBottom <= 200 && areNewMessages || scrollBottom <= 55 && typingUsersChange);
    }

    fetchMoreMessages() {

        const {
            fetchingMoreMessages,
            fetchingMoreMessagesError,
            noMoreMessages,
            sentMessages
        } = this.props;

        if (
            this.scrollableAreaRef.scrollTop > 100 ||
            fetchingMoreMessages ||
            fetchingMoreMessagesError ||
            noMoreMessages ||
            !sentMessages[0]
        ) {

            return;
        }

        this.props.fetchMoreMessages(sentMessages[0].id);
    }

    areOlderMessagesFetched(props = this.props) {

        const firstMessage = props.sentMessages[0];
        const { firstFetchedMessageID } = this;

        return !!firstMessage && (firstMessage.id !== firstFetchedMessageID);
    }

    onOlderMessagesFetching(nextProps) {

        if (this.areOlderMessagesFetched(nextProps)) {

            this.scrollableAreaPrevScrollHeight = this.scrollableAreaRef.scrollHeight;
        }
    }

    scrollToTheLastPosition() {

        const { scrollableArea } = this;
        const newScrollTop = scrollableArea.scrollHeight - this.scrollableAreaPrevScrollHeight;

        if (scrollableArea.scrollTop < newScrollTop) {

            scrollableArea.scrollTop = newScrollTop;
        }
    }
}

Chat.propTypes = {
    // redux
    fetchMoreMessages: propTypes.func.isRequired,
    noMoreMessages: propTypes.bool.isRequired,
    fetchingMoreMessages: propTypes.bool.isRequired,
    username: propTypes.string.isRequired,
    typingUsers: propTypes.arrayOf(propTypes.string).isRequired,
    isMobileSidebarOpened: propTypes.bool.isRequired,
    fetchingMoreMessagesError: propTypes.instanceOf(Error),

    // i18n
    t: propTypes.func.isRequired,

    sendingMessages: propTypes.arrayOf(
        propTypes.shape({
            tempId: propTypes.string.isRequired,
            attachment: propTypes.object,

            sendingError(props, propName) {

                const sendingError = props[propName];
                const { attachment } = props;

                if (attachment && sendingError !== undefined && sendingError !== null) {

                    return new Error(
                        'sendingMessages[].sendingError can be provided ' +
                        'only to message without attachment'
                    );
                }

                if (!attachment && Boolean(sendingError) !== sendingError) {

                    return new Error(
                        'each message without attachment, which is being sent' +
                        'has to contain boolean sendingError prop'
                    );
                }
            }
        })
    ).isRequired,

    sentMessages: propTypes.arrayOf(
        propTypes.shape({
            id: propTypes.number.isRequired,
            attachment: propTypes.object,
            date: datePropValidator('sentMessages[].date validation error'),

            author: propTypes.shape({
                username: propTypes.string.isRequired
            }).isRequired
        })
    ).isRequired
};

Chat.defaultProps = {
    // redux
    fetchingMoreMessagesError: null
};

export default compose(withNamespaces(), connect(mapStateToProps, mapDispatchToProps))(Chat);