import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';

import AuthenticatedPageLoader from '../authenticatedPageLoader/AuthenticatedPageLoader';
import Sidebar from '../sidebar/Sidebar';
import Chat from '../chat/Chat';

import { fetchMessages, markMessagesAsRead } from '../../actions/messages';
import { initSocket } from '../../actions/socket';

import baseStrings from '../../shared/baseStrings';
import strings from './strings';

import './authenticatedPage.scss';

function mapStateToProps(state) {

    const { users, messages, socket } = state;

    return {
        usersFetched: users.fetched,
        messagesFetched: messages.fetched,
        socketConnected: socket.connected,
        socketConnectionError: socket.connectionError,
        unreadMessages: messages.unreadMessages
    };
}

function mapDispatchToProps(dispatch) {

    return {
        fetchMessages: bindActionCreators(fetchMessages, dispatch),
        initSocket: bindActionCreators(initSocket, dispatch),
        markMessagesAsRead: bindActionCreators(markMessagesAsRead, dispatch)
    };
}

class AuthenticatedPage extends Component {

    constructor() {

        super();

        this.markMessagesAsRead = this.markMessagesAsRead.bind(this);
    }

    render() {

        const {
            usersFetched,
            messagesFetched, 
            socketConnected,
            socketConnectionError
        } = this.props;

        if (!usersFetched || !messagesFetched) {

            return <AuthenticatedPageLoader />;
        }

        return (
            <div 
                className="page page--authenticated"
                onMouseMove={this.markMessagesAsRead}
                onKeyDown={this.markMessagesAsRead}
            >

                {
                    !socketConnected &&

                    <p className="page__no-connection">
                    
                        {
                            (socketConnectionError) ?
                            strings.socketReconnectionError :
                            strings.socketDisconnected
                        }

                    </p>
                }

                <div className="page__wrapper--authenticated">
                    <Sidebar />
                    <Chat />
                </div>
            </div>
        );
    }

    componentDidMount() {

        this.updatePageTitle();
        this.props.fetchMessages();
        this.props.initSocket();
    }

    componentWillReceiveProps(nextProps) {

        this.onUnreadMessage(nextProps);
    }

    onUnreadMessage(nextProps) {

        if (nextProps.unreadMessages !== this.props.unreadMessages) {

            this.updatePageTitle(nextProps);
        }  
    }

    updatePageTitle(props = this.props) {

        const { unreadMessages } = props;
        const notification = (unreadMessages > 0) ? `(${unreadMessages}) ` : '';

        document.title = notification + baseStrings.basePageTitle;
    }

    markMessagesAsRead() {

        if (this.props.unreadMessages > 0) {

            this.props.markMessagesAsRead();
        }
    }
}

AuthenticatedPage.propTypes = {
    // redux
    usersFetched: propTypes.bool.isRequired,
    messagesFetched: propTypes.bool.isRequired,
    socketConnected: propTypes.bool.isRequired,
    socketConnectionError: propTypes.bool.isRequired,
    unreadMessages: propTypes.number.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedPage);