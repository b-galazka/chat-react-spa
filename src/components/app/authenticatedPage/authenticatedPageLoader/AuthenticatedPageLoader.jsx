import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { compose } from 'redux';

import LoadingAnimation from '../../loadingAnimation/LoadingAnimation';

import './authenticatedPageLoader.scss';

function mapStateToProps(state) {

    const { users, messages, socket } = state;

    return {
        usersFetchingError: users.fetchingError,
        messagesFetchingError: messages.fetchingError,
        socketConnectionError: socket.connectionError
    };
}

function AuthenticatedPageLoader({
    usersFetchingError,
    messagesFetchingError,
    socketConnectionError,
    t
}) {

    return (
        <div className="page__loader page__loader--authenticated">

            {
                (usersFetchingError || messagesFetchingError || socketConnectionError) ?

                    <p className="page__loading-error">{t('fetchingError')}</p> :

                    <LoadingAnimation />
            }

        </div>
    );
}

AuthenticatedPageLoader.propTypes = {
    // redux
    usersFetchingError: propTypes.bool.isRequired,
    socketConnectionError: propTypes.bool.isRequired,
    messagesFetchingError: propTypes.instanceOf(Error),

    // i18n
    t: propTypes.func.isRequired
};

AuthenticatedPageLoader.defaultProps = {
    // redux
    messagesFetchingError: null
};

export default compose(withNamespaces(), connect(mapStateToProps))(AuthenticatedPageLoader);