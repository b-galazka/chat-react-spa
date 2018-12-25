import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import FormComponent from '@src/components/abstracts/FormComponent';
import { authenticate } from '@src/actions/auth';

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

        const { t } = this.props;

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
                        {t('loginForm.usernameLabel')}:
                    </label>

                    {this.renderUsernameField()}

                    <label className="auth-input__label">
                        {t('loginForm.passwordLabel')}:
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

        const { t, authError } = this.props;
        const { response } = authError;

        if (!response || response && response.status !== 403) {

            return t('unknownError');
        }

        return t('loginForm.invalidCredentials');
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

        const { t } = this.props;

        return (
            <input
                type="submit"
                value={t('loginForm.loginButtonText')}
                className={

                    classNames({
                        button: true,
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

LoginForm.propTypes = {
    // redux
    authenticate: propTypes.func.isRequired,
    authError: propTypes.instanceOf(Error),

    // i18n
    t: propTypes.func.isRequired
};

LoginForm.defaultProps = {
    // redux
    authError: null
};

export default compose(
    withNamespaces(),
    connect(mapStateToProps, mapDispatchToProps)
)(LoginForm);