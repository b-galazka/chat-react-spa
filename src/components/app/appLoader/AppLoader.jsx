import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingAnimation from '../loadingAnimation/LoadingAnimation';

import baseStrings from '../strings';
import strings from './strings';

import '../app.scss';

function mapStateToProps(state) {

    const { fetchingCurrentUserError, logoutError } = state.auth;

    return { fetchingCurrentUserError, logoutError };
}

class AppLoader extends Component {

    render() {

        const { fetchingCurrentUserError, logoutError } = this.props;

        return (
            <div className="page__loader">

                {
                    fetchingCurrentUserError || logoutError ?
                        <p className="page__loading-error">{this.renderErrorText()}</p> :
                        <LoadingAnimation />
                }

            </div>
        );
    }

    renderErrorText() {

        if (this.props.fetchingCurrentUserError) {

            return baseStrings.fetchingError;
        }

        return strings.logoutError;
    }
}

AppLoader.propTypes = {
    // redux
    fetchingCurrentUserError: propTypes.instanceOf(Error),
    logoutError: propTypes.instanceOf(Error)
};

AppLoader.defaultProps = {
    // redux
    fetchingCurrentUserError: null,
    logoutError: null
};

export default connect(mapStateToProps)(AppLoader);