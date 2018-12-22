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

    const { user, fetchingCurrentUser, fetchingCurrentUserError } = state.auth;

    return { user, fetchingCurrentUser, fetchingCurrentUserError };
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

        if (this.props.fetchingCurrentUser || this.props.fetchingCurrentUserError) {

            return <AppLoader />;
        }

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

    componentDidMount() {

        this.props.fetchCurrentUser();
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
    fetchCurrentUser: propTypes.func.isRequired,
    fetchingCurrentUser: propTypes.bool.isRequired,
    fetchingCurrentUserError: propTypes.bool.isRequired,

    user: propTypes.shape({
        id: propTypes.number.isRequired,
        username: propTypes.string.isRequired
    })
};

App.defaultProps = {
    // redux
    user: null
};

export default connect(mapStateToProps, mapDispatchToProps)(App);