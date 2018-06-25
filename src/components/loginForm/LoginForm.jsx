import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import FormComponent from '../abstracts/FormComponent';

import { authenticate } from '../../actions/auth';

import strings from './strings';
import unauthPageStrings from '../unauthenticatedPage/strings';

function mapStateToProps(state) {

    const { authError } = state.auth;

    return { authError };
}

function mapDispatchToProps(dispatch) {

    return {
        authenticate: bindActionCreators(authenticate, dispatch)
    };
}

class LoginForm extends FormComponent {

    constructor() {

        super();

        this.state = {
            username: '',
            password: ''
        };

        this.submitForm = this.submitForm.bind(this);
    }

    render() {

        return (
            <section className="page__auth-section page__auth-section--login">
                <form onSubmit={this.submitForm}>

                    {
                        this.props.authError &&

                        <p className="auth-message auth-message--error">
                            {this.renderAuthError()}
                        </p>
                    }

                    <label className="auth-input__label">
                        {unauthPageStrings.usernameLabel}:
                    </label>

                    {this.renderUsernameField()}

                    <label className="auth-input__label">
                        {unauthPageStrings.passwordLabel}:
                    </label>
                    
                    {this.renderPasswordField()}

                    {this.renderSubmitButton()}
                </form>
            </section>
        );
    }

    componentWillReceiveProps(nextProps) {

        this.onAuthError(nextProps);
    }

    renderAuthError() {

        const { authError } = this.props;

        if (!authError.response) {

            return unauthPageStrings.unknownError;
        } 
        
        const { status } = authError.response;
        
        if (status === 403) {

            return strings.invalidCredentials;
        }

        return unauthPageStrings.unknownError;
    }

    renderUsernameField() {

        return (
            <input
                type="text"
                className="auth-input"
                value={this.state.username}
                onChange={this.updateInputValue('username')}
                autoFocus
            />
        );
    }

    renderPasswordField() {

        return (
            <input
                type="password"
                className="auth-input"
                value={this.state.password}
                onChange={this.updateInputValue('password')}
            />
        );
    }

    renderSubmitButton() {

        return (
            <input
                type="submit"
                value={strings.loginButtonText}
                className={

                    classNames({
                        'button': true,
                        'button--auth-submit': true,
                        'button--disabled': this.isInvalidDataProvided()
                    })
                }
            />
        );
    }

    onAuthError(nextProps) {

        if (nextProps.authError && !this.props.authError) {

            this.setState({
                password: ''
            });
        }
    }

    isInvalidDataProvided() {

        const { username, password } = this.state;

        return (username.trim().length === 0 || password.length === 0);
    }

    submitForm(event) {

        event.preventDefault();

        if (this.isInvalidDataProvided()) {

            return;
        }

        const { username, password } = this.state;

        this.props.authenticate(username, password);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);