import React, { Fragment } from 'react';
import classNames from 'classnames';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import FormComponent from '@src/components/abstracts/FormComponent';
import LoadingAnimation from '@src/components/utils/loadingAnimation/LoadingAnimation';

import axios from '@src/utils/axios';
import { createUser } from '@src/actions/users';

import sharedStyles from '@appComponent/shared.scss';
import unauthPageSharedStyles from '../shared.scss';
import styles from './registrationForm.scss';

function mapStateToProps(state) {

    const { users } = state;

    return {
        userCreated: users.created,
        userCreationError: users.creationError
    };
}

function mapDispatchToProps(dispatch) {

    return {
        createUser: bindActionCreators(createUser, dispatch)
    };
}

class RegistrationForm extends FormComponent {

    constructor() {

        super();

        this.state = {
            username: '',
            password: '',
            repeatedPassword: '',
            usernameErrors: [],
            passwordErrors: [],
            repeatedPasswordErrors: [],
            usernameAvailabilityChecking: false,
            usernameAvailabilityCheckingError: null,
            fieldsDisabled: false
        };

        this.lastValidatedUsername = null;
        this.usernameAvailabilityCheckingPromise = null;

        this.bindMethodsToThis();
    }

    render() {

        const { userCreationError, userCreated, t } = this.props;

        return (
            <section className={unauthPageSharedStyles.authSection}>
                <form onSubmit={this.submitForm}>

                    {
                        userCreationError &&

                        <p
                            className={classNames(
                                unauthPageSharedStyles.authMessage,
                                unauthPageSharedStyles.authMessageError
                            )}
                        >
                            {this.renderUserCreationError()}
                        </p>
                    }

                    {
                        userCreated &&

                        <p
                            className={classNames(
                                unauthPageSharedStyles.authMessage,
                                unauthPageSharedStyles.authMessageInfo
                            )}
                        >
                            {t('registrationForm.userCreated')}
                        </p>
                    }

                    {this.renderUsernameField()}
                    {this.renderPasswordField()}
                    {this.renderRepeatedPasswordField()}
                    {this.renderSubmitButton()}
                </form>
            </section>
        );
    }

    componentDidUpdate(prevProps) {

        this.onUserCreationError(prevProps);
        this.onUserCreated(prevProps);
    }

    bindMethodsToThis() {

        this.validateUsername = this.validateUsername.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateRepeatedPassword = this.validateRepeatedPassword.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    renderUserCreationError() {

        const { userCreationError, t } = this.props;
        const { response } = userCreationError;
        const resStatus = response && response.status;

        switch (resStatus) {

            case 409:
                return t('registrationForm.usernameNotAvailableErr');

            case 400:
                return t('registrationForm.validationError');

            default:
                return t('unknownError');
        }
    }

    renderUsernameField() {

        const {
            usernameErrors,
            usernameAvailabilityChecking,
            usernameAvailabilityCheckingError
        } = this.state;

        const { t } = this.props;
        const isInvalid = (usernameErrors.length !== 0);

        return (
            <Fragment>
                <label className={unauthPageSharedStyles.authInputLabel}>
                    {t('registrationForm.usernameLabel')}:
                </label>

                <div className={styles.authInputWrapper}>
                    <input
                        type="text"
                        className={

                            classNames({
                                [unauthPageSharedStyles.authInput]: true,
                                [unauthPageSharedStyles.authInputInvalid]: isInvalid
                            })
                        }

                        disabled={usernameAvailabilityChecking}
                        value={this.state.username}
                        onChange={this.updateInputValue('username')}
                        onBlur={this.validateUsername}
                    />

                    {
                        usernameAvailabilityChecking &&

                        <div className={styles.authInputLoadingAnimation}>
                            <LoadingAnimation
                                width="30px"
                                height="30px"
                                thickness={5}
                            />
                        </div>
                    }
                </div>

                {
                    usernameAvailabilityCheckingError &&

                    <p className={styles.authInputError}>
                        {t('registrationForm.usernameAvailabilityUnknownErr')}
                    </p>
                }

                {RegistrationForm.renderValidationErrors(usernameErrors)}
            </Fragment>
        );
    }

    renderPasswordField() {

        const { passwordErrors, fieldsDisabled } = this.state;
        const { t } = this.props;

        return (
            <Fragment>
                <label className={unauthPageSharedStyles.authInputLabel}>
                    {t('registrationForm.passwordLabel')}:
                </label>

                <input
                    type="password"
                    className={

                        classNames({
                            [unauthPageSharedStyles.authInput]: true,
                            [unauthPageSharedStyles.authInputInvalid]: (passwordErrors.length !== 0)
                        })
                    }

                    disabled={fieldsDisabled}
                    value={this.state.password}
                    onChange={this.updateInputValue('password')}
                    onBlur={this.validatePassword}
                />

                {RegistrationForm.renderValidationErrors(passwordErrors)}
            </Fragment>
        );
    }

    renderRepeatedPasswordField() {

        const { repeatedPasswordErrors, fieldsDisabled } = this.state;
        const { t } = this.props;

        return (
            <Fragment>
                <label className={unauthPageSharedStyles.authInputLabel}>
                    {t('registrationForm.repeatedPasswordLabel')}:
                </label>

                <input
                    type="password"
                    className={

                        classNames({
                            [unauthPageSharedStyles.authInput]: true,

                            [unauthPageSharedStyles.authInputInvalid]: (
                                repeatedPasswordErrors.length !== 0
                            )
                        })
                    }

                    disabled={fieldsDisabled}
                    value={this.state.repeatedPassword}
                    onChange={this.updateInputValue('repeatedPassword')}
                    onBlur={this.validateRepeatedPassword}
                />

                {RegistrationForm.renderValidationErrors(repeatedPasswordErrors)}
            </Fragment>
        );
    }

    static renderValidationErrors(errors) {

        if (errors.length === 0) {

            return null;
        }

        const renderedErrors = errors.map((error, index) => (
            <li className={styles.authInputError} key={index}>{error}</li>
        ));

        return <ul className={styles.authInputErrorsList}>{renderedErrors}</ul>;
    }

    renderSubmitButton() {

        const { usernameAvailabilityChecking } = this.state;
        const { t } = this.props;

        return (
            <input
                type="submit"
                value={t('registrationForm.submitButtonText')}
                className={

                    classNames({
                        [sharedStyles.button]: true,
                        [unauthPageSharedStyles.buttonSubmit]: true,
                        [sharedStyles.buttonDisabled]: usernameAvailabilityChecking
                    })
                }
            />
        );
    }

    updateUsernameAvailabilityStatus(usernameAvailability) {

        const errors = [];
        const { t } = this.props;

        if (!usernameAvailability.free) {

            errors.push(t('registrationForm.usernameNotAvailableErr'));
        }

        this.setState({
            usernameErrors: errors
        });
    }

    validateUsername() {

        const { username, usernameErrors } = this.state;

        if (
            this.lastValidatedUsername === username &&
            !this.state.usernameAvailabilityCheckingError ||
            this.state.usernameAvailabilityChecking
        ) {

            return (usernameErrors.length === 0);
        }

        this.lastValidatedUsername = username;

        const errors = this.validateUsernameSync();

        this.setState({
            usernameErrors: errors
        });

        if (errors.length === 0) {

            this.checkUsernameAvailability();

            return true;
        }

        return false;
    }

    validateUsernameSync() {

        const errors = [];
        const { username } = this.state;
        const { t } = this.props;

        if (username.length < 3 || username.length > 16) {

            errors.push(t('registrationForm.usernameLengthErr'));
        }

        if (/[^a-z0-9_]/i.test(username)) {

            errors.push(t('registrationForm.usernameCharactersErr'));
        }

        return errors;
    }

    checkUsernameAvailability() {

        const { username } = this.state;

        this.checkingUsernameAvailabilityRequested();

        this.usernameAvailabilityCheckingPromise = (async () => {

            try {

                const { data } = await axios.post('/users/username-availability', { username });

                this.updateUsernameAvailabilityStatus(data);
                this.checkingUsernameAvailabilitySucceeded(data);

                return data;
            } catch (err) {

                this.checkingUsernameAvailabilityFailed(err);
            }
        })();
    }

    checkingUsernameAvailabilityRequested() {

        this.setState({
            usernameAvailabilityChecking: true,
            usernameAvailabilityCheckingError: null
        });
    }

    checkingUsernameAvailabilitySucceeded() {

        this.setState({
            usernameAvailabilityChecking: false,
            usernameAvailabilityCheckingError: null
        });
    }

    checkingUsernameAvailabilityFailed(err) {

        this.setState({
            usernameAvailabilityChecking: false,
            usernameAvailabilityCheckingError: err
        });
    }

    validatePassword() {

        const errors = [];
        const { password } = this.state;
        const { t } = this.props;

        if (password.length < 8 || password.length > 32) {

            errors.push(t('registrationForm.passwordLengthErr'));
        }

        if (!this.passwordContainsRequiredCharacters()) {

            errors.push(t('registrationForm.passwordCharactersErr'));
        }

        this.setState({ passwordErrors: errors });

        return (errors.length === 0);
    }

    passwordContainsRequiredCharacters() {

        const { password } = this.state;

        return (
            /\d/.test(password) &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\W/.test(password)
        );
    }

    validateRepeatedPassword() {

        const errors = [];
        const { password, repeatedPassword } = this.state;
        const { t } = this.props;

        if (password !== repeatedPassword) {

            errors.push(t('registrationForm.passwordsEqualityErr'));
        }

        this.setState({ repeatedPasswordErrors: errors });

        return (errors.length === 0);
    }

    async submitForm(event) {

        event.preventDefault();

        if (!this.isFormValid()) {

            return;
        }

        this.setState({ fieldsDisabled: true });

        const { username, password } = this.state;
        const usernameAvailability = await this.usernameAvailabilityCheckingPromise;

        this.setState({ fieldsDisabled: false });

        if (usernameAvailability && !usernameAvailability.free) {

            return;
        }

        this.props.createUser({ username, password });
    }

    isFormValid() {

        const validUsername = this.validateUsername();
        const validPassword = this.validatePassword();
        const validRepeatedPassword = this.validateRepeatedPassword();

        return validUsername && validPassword && validRepeatedPassword;
    }

    onUserCreationError(prevProps) {

        if (!prevProps.userCreationError && this.props.userCreationError) {

            this.setState({
                password: '',
                repeatedPassword: '',
                usernameAvailabilityCheckingError: null
            });
        }
    }

    onUserCreated(prevProps) {

        if (!prevProps.userCreated && this.props.userCreated) {

            this.setState({
                username: '',
                password: '',
                repeatedPassword: '',
                usernameAvailabilityCheckingError: null
            });
        }
    }
}

RegistrationForm.propTypes = {
    // redux
    userCreated: propTypes.bool.isRequired,
    createUser: propTypes.func.isRequired,
    userCreationError: propTypes.instanceOf(Error),

    // i18n
    t: propTypes.func.isRequired
};

RegistrationForm.defaultProps = {
    // redux
    userCreationError: null
};

export default compose(
    withNamespaces(),
    connect(mapStateToProps, mapDispatchToProps)
)(RegistrationForm);