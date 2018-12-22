import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';

import UnauthenticatedPage from './unauthenticatedPage/UnauthenticatedPage';
import AuthenticatedPage from './authenticatedPage/AuthenticatedPage';
import NotFound from './notFound/NotFound';
import AppLoader from './appLoader/AppLoader';

import { fetchCurrentUser } from 'actions/auth';

import './app.scss';

function mapStateToProps(state) {

    const {
        user,
        fetchingCurrentUserError,
        fetchingCurrentUser,
        loggingOut,
        logoutError
    } = state.auth;

    return {
        user,
        fetchingCurrentUserError,
        fetchingCurrentUser,
        loggingOut,
        logoutError
    };
}

function mapDispatchToProps(dispatch) {

    return {
        fetchCurrentUser: bindActionCreators(fetchCurrentUser, dispatch)
    };
}

class App extends Component {

    constructor() {

        super();

        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
    }

    render() {

        if (this.isAppReady()) {

            return this.renderAppConent();
        }

        return <AppLoader />
    }

    componentDidMount() {

        this.props.fetchCurrentUser();
    }

    renderAppConent() {

        return (
            <BrowserRouter>
                <main>
                    <Switch>
                        <Route exact path="/" render={this.isUserAuthenticated} />
                        <Route component={NotFound} />
                    </Switch>
                </main>
            </BrowserRouter>
        );
    }

    isAppReady() {

        const {
            fetchingCurrentUserError,
            fetchingCurrentUser,
            loggingOut,
            logoutError
        } = this.props;

        return ( !fetchingCurrentUserError && !fetchingCurrentUser && !loggingOut && !logoutError);
    }

    isUserAuthenticated() {

        const { user } = this.props;

        if (user) {

            return <AuthenticatedPage />;
        }

        return <UnauthenticatedPage />;
    }
}

App.propTypes = {
    // redux
    fetchingCurrentUser: propTypes.bool.isRequired,
    loggingOut: propTypes.bool.isRequired,

    fetchingCurrentUserError: propTypes.instanceOf(Error),
    logoutError: propTypes.instanceOf(Error),

    user: propTypes.shape({
        id: propTypes.number.isRequired,
        username: propTypes.string.isRequired
    })
};

App.defaultProps = {
    // redux
    user: null,
    logoutError: null,
    fetchingCurrentUserError: null
};

export default connect(mapStateToProps, mapDispatchToProps)(App);