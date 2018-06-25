import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MessageForm from '../messageForm/MessageForm';
import Message from '../message/Message';
import LoadingAnimation from '../loadingAnimation/LoadingAnimation';

import { fetchMoreMessages } from '../../actions/messages';

import strings from './strings';
import timeUnits from '../../shared/timeUnitsInMs';

import './chat.scss';

function mapStateToProps(state) {

    const {
        sending,
        sent,
        fetchedAll,
        fetchingMore,
        fetchingMoreError
    } = state.messages;

    const { username } = state.auth.tokenData;
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

            const displayTimeHeader = this.shouldDisplayTimeHeader(index);

            return (
                <Message
                    key={message.id}
                    message={message}
                    displayAuthor={this.shouldDisplayAuthor(index, displayTimeHeader)}
                    displayTimeHeader={displayTimeHeader}
                />
            );
        });
    }

    renderSendingMessages() {

        const { sendingMessages } = this.props;

        return sendingMessages.map(message => (
            <Message key={message.tempID} message={message} sending />
        ));
    }

    renderTypingUsers() {

        const { typingUsers } = this.props;

        if (typingUsers.length === 0) {

            return null;
        }

        const typingText = strings.typing[
            (typingUsers.length > 1) ? 'multiplePersons' : 'singlePerson'
        ];

        const usernames = (

            (typingUsers.length > 2) ?

                typingUsers.slice(0, -1).join(', ') +
                ` ${strings.and} ${typingUsers[typingUsers.length - 1]}` :

                typingUsers.join(` ${strings.and} `)
        );

        return (
            <p className="chat__typing-users">
                {usernames} {typingText}...
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);