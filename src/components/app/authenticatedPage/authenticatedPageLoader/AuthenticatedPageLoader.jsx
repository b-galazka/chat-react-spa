import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { compose } from 'redux';
import classNames from 'classnames';

import LoadingAnimation from '@src/components/utils/loadingAnimation/LoadingAnimation';

import sharedStyles from '@appComponent/shared.scss';
import styles from './authenticatedPageLoader.scss';

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
        <div className={classNames(sharedStyles.loader, styles.loaderAuthenticated)}>

            {
                (usersFetchingError || messagesFetchingError || socketConnectionError) ?

                    <p className={sharedStyles.loaderError}>{t('fetchingError')}</p> :

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