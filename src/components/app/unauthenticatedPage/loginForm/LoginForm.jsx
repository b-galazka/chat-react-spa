import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import FormComponent from '@src/components/abstracts/FormComponent';
import Checkbox from '@src/components/utils/checkbox/Checkbox';
import { authenticate } from '@src/actions/auth';

import sharedStyles from '@appComponent/shared.scss';
import unauthPageSharedStyles from '../shared.scss';
import styles from './loginForm.scss';

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
            password: '',
            keepSignedIn: false
        };

        this.submitForm = this.submitForm.bind(this);
    }

    render() {

        return (
            <section className={classNames(unauthPageSharedStyles.authSection, styles.loginForm)}>
                <form onSubmit={this.submitForm}>

                    {
                        this.props.authError &&

                        <p
                            className={classNames(
                                unauthPageSharedStyles.authMessage,
                                unauthPageSharedStyles.authMessageError
                            )}
                        >
                            {this.renderAuthError()}
                        </p>
                    }

                    {this.renderUsernameField()}
                    {this.renderPasswordField()}
                    {this.renderKeepSignedInCheckbox()}
                    {this.renderSubmitButton()}
                </form>
            </section>
        );
    }

    componentDidUpdate(prevProps) {

        this.onAuthError(prevProps);
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

        const { t } = this.props;

        return (
            <Fragment>
                <label className={unauthPageSharedStyles.authInputLabel}>
                    {t('loginForm.usernameLabel')}:
                </label>

                <input
                    type="text"
                    className={unauthPageSharedStyles.authInput}
                    value={this.state.username}
                    onChange={this.updateInputValue('username')}
                    autoFocus
                />
            </Fragment>
        );
    }

    renderPasswordField() {

        const { t } = this.props;

        return (
            <Fragment>
                <label className={unauthPageSharedStyles.authInputLabel}>
                    {t('loginForm.passwordLabel')}:
                </label>

                <input
                    type="password"
                    className={unauthPageSharedStyles.authInput}
                    value={this.state.password}
                    onChange={this.updateInputValue('password')}
                />
            </Fragment>
        );
    }

    renderKeepSignedInCheckbox() {

        const { t } = this.props;

        return (
            <Checkbox
                checked={this.state.keepSignedIn}
                onChange={this.updateInputValue('keepSignedIn')}
                className={styles.checkbox}
            >
                {t('loginForm.keepSignedInLabel')}
            </Checkbox>
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
                        [sharedStyles.button]: true,
                        [unauthPageSharedStyles.buttonSubmit]: true,
                        [sharedStyles.buttonDisabled]: this.isInvalidDataProvided()
                    })
                }
            />
        );
    }

    onAuthError(prevProps) {

        if (!prevProps.authError && this.props.authError) {

            this.setState({ password: '' });
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

        const { username, password, keepSignedIn } = this.state;

        this.props.authenticate({ username, password, keepSignedIn });
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