import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingAnimation from '../loadingAnimation/LoadingAnimation';

import strings from '../strings';

import '../app.scss';

function mapStateToProps(state) {

    const { fetchingCurrentUserError } = state.auth;

    return { fetchingCurrentUserError };
}

function AppLoader(props) {

    return (
        <div className="page__loader">

            {
                props.fetchingCurrentUserError ?
                    <p className="page__loading-error">{strings.fetchingError}</p> :
                    <LoadingAnimation />
            }

        </div>
    );
}

AppLoader.propTypes = {
    // redux
    fetchingCurrentUserError: propTypes.bool.isRequired
};

export default connect(mapStateToProps)(AppLoader);