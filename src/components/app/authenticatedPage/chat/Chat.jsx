import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';

// must be imported before children components are imported 
// let children components ovverride their styles
import './chat.scss';

import MessageForm from './messageForm/MessageForm';
import Message from './message/Message';
import LoadingAnimation from '../../loadingAnimation/LoadingAnimation';
import AttachmentUpload from './attachmentUpload/AttachmentUpload';
import Attachment from './attachment/Attachment';

import { fetchMoreMessages } from 'actions/messages';

import renderText from 'utils/renderText';

import strings from './strings';
import timeUnits from './timeUnitsInMs';

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

    return {
        sendingMessages: sending,
        sentMessages: sent,
        noMoreMessages: fetchedAll,
        fetchingMoreMessages: fetchingMore,
        fetchingMoreMessagesError: fetchingMoreError, 
        username,
        typingUsers
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

        this.fetchMoreMessages = this.fetchMoreMessages.bind(this);
    }

    render() {

        const {
            sendingMessages,
            sentMessages,
            fetchingMoreMessages,
            fetchingMoreMessagesError
        } = this.props;

        return (
            <section className="chat">
                <section
                    className="chat__messages-area" 
                    ref={(ref) => { this.scrollableArea = ref; }}
                    onScroll={this.fetchMoreMessages}
                >

                    {
                        fetchingMoreMessages &&

                        <figure className="chat__fetching-more-messages-loader">
                            <LoadingAnimation width="50px" height="50px"/>
                        </figure>
                    }

                    {
                        fetchingMoreMessagesError &&

                        <p className="chat__fetching-more-messages-error">
                            {strings.fetchingMoreMessagesError}
                        </p>
                    }

                    {
                        (sendingMessages.length === 0 && sentMessages.length === 0) &&
                        <p className="chat__no-messages">{strings.noMessages}</p>
                    }

                    {this.renderSentMessages()}
                    {this.renderSendingMessages()}
                </section>

                {this.renderTypingUsers()}

                <MessageForm />
            </section>
        );
    }

    componentDidMount() {

        this.scrollDown();
    }

    componentDidUpdate() {

        if (this.areOlderMessagesBeingFetched()) {

            this.scrollToTheLastPosition();
            this.firstFetchedMessageID = this.props.sentMessages[0].id;

            return;
        }
        
        if (this.shouldScrollDown()) {

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

        const { typingUsers } = this.props;

        if (typingUsers.length === 0) {

            return null;
        }

        const text = (

            (typingUsers.length === 1) ?

            renderText(strings.typing.singlePerson, { username: typingUsers[0] }) :

            renderText(strings.typing.multiplePersons, {
                usernames: typingUsers.slice(0, -1).join(', '),
                lastUsername: typingUsers[typingUsers.length - 1]
            })
        );

        return <p className="chat__typing-users">{text}</p>;
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

        const { scrollableArea } = this;

        scrollableArea.scrollTop = scrollableArea.scrollHeight;
    }

    shouldScrollDown() {

        const { scrollHeight, scrollTop, clientHeight } = this.scrollableArea;
        const scrollBottom = scrollHeight - scrollTop - clientHeight;

        return (scrollBottom <= 200);
    }

    fetchMoreMessages() {

        const {
            fetchingMoreMessages,
            fetchingMoreMessagesError,
            noMoreMessages,
            sentMessages
        } = this.props;

        if (
            this.scrollableArea.scrollTop > 100 ||
            fetchingMoreMessages ||
            fetchingMoreMessagesError ||
            noMoreMessages ||
            !sentMessages[0]
        ) {

            return;
        }

        this.props.fetchMoreMessages(sentMessages[0].id);
    }

    areOlderMessagesBeingFetched(props = this.props) {

        const firstMessage = props.sentMessages[0];
        const { firstFetchedMessageID } = this;

        if (!firstMessage) {

            return false;
        }

        return (firstMessage.id !== firstFetchedMessageID);
    }

    onOlderMessagesFetching(nextProps) {

        if (this.areOlderMessagesBeingFetched(nextProps)) {

            this.scrollableAreaPrevScrollHeight = this.scrollableArea.scrollHeight;
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
    fetchingMoreMessagesError: propTypes.instanceOf(Error),

    sendingMessages: propTypes.arrayOf(
        propTypes.shape({
            tempId: propTypes.string.isRequired,
            attachment: propTypes.object,

            sendingError(props, propName) {

                const sendingError = props[propName];
                const attachment = props.attachment;

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

            date(props, propName) {

                const propValue = props[propName];

                if (new Date(propValue).toString() === 'Invalid Date') {

                    return new Error('sentMessages[].date validation error');
                }
            },

            author: propTypes.shape({
                username: propTypes.string.isRequired
            }).isRequired,
        })
    ).isRequired
};

Chat.defaultProps = {
    // redux
    fetchingMoreMessagesError: null
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);