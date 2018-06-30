import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwtDecode from 'jwt-decode';
import cookies from 'js-cookie';
import propTypes from 'prop-types';

import UnauthenticatedPage from './unauthenticatedPage/UnauthenticatedPage';
import AuthenticatedPage from './authenticatedPage/AuthenticatedPage';
import NotFound from './notFound/NotFound';

import { putToken } from 'actions/auth';

import './app.scss';

function mapStateToProps(state) {

    const { token } = state.auth;

    return { token };
}

function mapDispatchToProps(dispatch) {

    return {
        putToken: bindActionCreators(putToken, dispatch)
    };
} 

class App extends Component {

    constructor() {

        super();

        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
    }

    componentWillMount() {

        this.loadTokenFromCookies();
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

        const { token } = this.props;

        if (token) {

            return <AuthenticatedPage />;
        }

        return <UnauthenticatedPage />;
    }

    loadTokenFromCookies() {

        const token = cookies.get('token');

        if (!token) {

            return;
        }

        try {

            const tokenData = jwtDecode(token);

            this.props.putToken(token, tokenData);
        } catch (err) {

            cookies.remove('token');
        }
    }
}

App.propTypes = {
    // redux
    putToken: propTypes.func.isRequired,
    token: propTypes.string
};

App.defaultProps = {
    // redux
    token: null
};

export default connect(mapStateToProps, mapDispatchToProps)(App);