import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cookies from 'js-cookie';
import propTypes from 'prop-types';

import UnauthenticatedPage from './unauthenticatedPage/UnauthenticatedPage';
import AuthenticatedPage from './authenticatedPage/AuthenticatedPage';
import NotFound from './notFound/NotFound';

import { putUserData } from 'actions/auth';

import './app.scss';

function mapStateToProps(state) {

    const { user } = state.auth;
    const username = user && user.username;

    return { username };
}

function mapDispatchToProps(dispatch) {

    return {
        putUserData: bindActionCreators(putUserData, dispatch)
    };
} 

class App extends Component {

    constructor() {

        super();

        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
    }

    componentWillMount() {

        this.loadUsernameFromCookies();
    }

    render() {
        
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

    isUserAuthenticated() {

        const { username } = this.props;

        if (username) {

            return <AuthenticatedPage />;
        }

        return <UnauthenticatedPage />;
    }

    loadUsernameFromCookies() {

        const username = cookies.get('username');

        if (!username) {

            return;
        }

        this.props.putUserData(username);
    }
}

App.propTypes = {
    // redux
    putUserData: propTypes.func.isRequired,
    username: propTypes.string
};

App.defaultProps = {
    // redux
    username: null
};

export default connect(mapStateToProps, mapDispatchToProps)(App);