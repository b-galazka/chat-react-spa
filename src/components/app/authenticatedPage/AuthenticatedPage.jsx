import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';

import AuthenticatedPageLoader from './authenticatedPageLoader/AuthenticatedPageLoader';
import AuthenticatedPageHeader from './authenticatedPageHeader/AuthenticatedPageHeader';
import Sidebar from './sidebar/Sidebar';
import Chat from './chat/Chat';
import Gallery from './gallery/Gallery';

import { fetchMessages, markMessagesAsRead } from '@src/actions/messages';
import { initSocket } from '@src/actions/socket';

import sharedStyles from '@appComponent/shared.scss';
import styles from './authenticatedPage.scss';

function mapStateToProps(state) {

    const { users, messages, socket, ui } = state;

    return {
        usersFetched: users.fetched,
        messagesFetched: messages.fetched,
        socketConnected: socket.connected,
        socketConnectionError: socket.connectionError,
        unreadMessages: messages.unreadMessages,
        isGalleryOpened: !!ui.galleryImage
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
            socketConnectionError,
            isGalleryOpened,
            t
        } = this.props;

        if (!usersFetched || !messagesFetched) {

            return <AuthenticatedPageLoader />;
        }

        return (
            <div
                className={classNames(sharedStyles.page, styles.pageAuthenticated)}
                onMouseMove={this.markMessagesAsRead}
                onKeyDown={this.markMessagesAsRead}
            >

                {
                    !socketConnected &&

                    <p className={styles.pageAuthenticatedNoConnection}>

                        {
                            socketConnectionError ?
                                t('authenticatedPage.socketReconnectionError') :
                                t('authenticatedPage.socketDisconnected')
                        }

                    </p>
                }

                <AuthenticatedPageHeader />

                <div className={styles.pageAuthenticatedWrapper}>
                    <Sidebar />
                    <Chat />
                </div>

                {
                    isGalleryOpened && <Gallery />
                }
            </div>
        );
    }

    componentDidMount() {

        this.updatePageTitle();
        this.props.fetchMessages();
        this.props.initSocket();
    }

    componentDidUpdate(prevProps) {

        this.onUnreadMessage(prevProps);
    }

    onUnreadMessage(prevProps) {

        if (prevProps.unreadMessages !== this.props.unreadMessages) {

            this.updatePageTitle(prevProps);
        }
    }

    updatePageTitle() {

        const { unreadMessages, t } = this.props;
        const title = (unreadMessages > 0) ? 'notificationSiteTitle' : 'siteTitle';

        document.title = t(title, { notification: unreadMessages });
    }

    markMessagesAsRead() {

        if (this.props.unreadMessages > 0) {

            this.props.markMessagesAsRead();
        }
    }
}

AuthenticatedPage.propTypes = {
    // redux
    fetchMessages: propTypes.func.isRequired,
    initSocket: propTypes.func.isRequired,
    markMessagesAsRead: propTypes.func.isRequired,
    usersFetched: propTypes.bool.isRequired,
    messagesFetched: propTypes.bool.isRequired,
    socketConnected: propTypes.bool.isRequired,
    socketConnectionError: propTypes.bool.isRequired,
    unreadMessages: propTypes.number.isRequired,
    isGalleryOpened: propTypes.bool.isRequired,

    // i18n
    t: propTypes.func.isRequired
};

export default compose(
    withNamespaces(),
    connect(mapStateToProps, mapDispatchToProps)
)(AuthenticatedPage);