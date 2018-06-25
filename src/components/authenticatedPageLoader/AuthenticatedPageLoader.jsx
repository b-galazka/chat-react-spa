import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import LoadingAnimation from '../loadingAnimation/LoadingAnimation';

import strings from './strings';

import './authenticatedPageLoader.scss';

function mapStateToProps(state) {

    const { users, messages, socket } = state;

    return {
        usersFetchingError: users.fetchingError,
        messagesFetchingError: messages.fetchingError,
        socketConnectionError: socket.connectionError
    };
}

function AuthenticatedPageLoader(props) {

    const {
        usersFetchingError, 
        messagesFetchingError, 
        socketConnectionError
    } = props;

    return (
        <div className="page__loader page__loader--authenticated">

            {
                (usersFetchingError || messagesFetchingError || socketConnectionError) ?

                <p className="page__loading-error">{strings.fetchingError}</p> :

                <LoadingAnimation />
            }
            
        </div>
    );
}

AuthenticatedPageLoader.propTypes = {
    // redux
    usersFetchingError: propTypes.bool.isRequired,
    socketConnectionError: propTypes.bool.isRequired,
    messagesFetchingError: propTypes.instanceOf(Error)
};

AuthenticatedPageLoader.defaultProps = {
    // redux
    messagesFetchingError: null
};

export default connect(mapStateToProps)(AuthenticatedPageLoader);