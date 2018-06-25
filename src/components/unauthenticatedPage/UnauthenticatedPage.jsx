import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import AuthLoader from '../authLoader/AuthLoader';
import LoginForm from '../loginForm/LoginForm';
import RegistrationForm from '../registrationForm/RegistrationForm';

import baseStrings from '../../shared/baseStrings';
import strings from './strings';

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

        document.title = `${baseStrings.basePageTitle} | ${strings.pageTitle}`;
    }
}

UnauthenticatedPage.propTypes = {
    // redux
    authenticating: propTypes.bool.isRequired,
    creatingUser: propTypes.bool.isRequired
};

export default connect(mapStateToProps)(UnauthenticatedPage);