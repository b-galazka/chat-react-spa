import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import AuthLoader from './authLoader/AuthLoader';
import LoginForm from './loginForm/LoginForm';
import RegistrationForm from './registrationForm/RegistrationForm';

import './unauthenticatedPage.scss';

function mapStateToProps(state) {

    const { authenticating } = state.auth;

    return {
        authenticating,
        creatingUser: state.users.creating
    };
}

class UnauthenticatedPage extends Component {

    render() {

        const { authenticating, creatingUser } = this.props;

        return (
            <div className="page page--unauthenticated">
                <div className="page__wrapper--unauthenticated">
                    <LoginForm />
                    <RegistrationForm />
                </div>

                {
                    (authenticating || creatingUser) &&
                    <AuthLoader />
                }

            </div>
        );
    }

    componentDidMount() {

        this.updatePageTitle();
    }

    updatePageTitle() {

        const { t } = this.props;

        document.title = t('pageTitle', { page: t('unauthenticatedPage.pageTitle') });
    }
}

UnauthenticatedPage.propTypes = {
    // redux
    authenticating: propTypes.bool.isRequired,
    creatingUser: propTypes.bool.isRequired,

    // i18n
    t: propTypes.func.isRequired
};

export default compose(withNamespaces(), connect(mapStateToProps))(UnauthenticatedPage);