import React from 'react';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import FormComponent from '../abstracts/FormComponent';
import LoadingAnimation from '../loadingAnimation/LoadingAnimation';

import axios from '../../shared/axios';
import { createUser } from '../../actions/users';

import strings from './strings';
import unauthPageStrings from '../unauthenticatedPage/strings';

import './registrationForm.scss';

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

        const {
            passwordErrors, 
            repeatedPasswordErrors, 
            usernameErrors
        } = this.state;

        const { userCreationError, userCreated } = this.props;

        return (
            <section className="page__auth-section page__auth-section--registration">
                <form onSubmit={this.submitForm}>

                    {
                        userCreationError &&

                        <p className="auth-message auth-message--error">
                            {this.renderUserCreationError()}
                        </p>
                    }

                    {
                        userCreated &&

                        <p className="auth-message auth-message--info">
                            {strings.userCreated}
                        </p>
                    }

                    <label className="auth-input__label">
                        {unauthPageStrings.usernameLabel}:
                    </label>

                    {this.renderUsernameField()}
                    
                    {
                        this.state.usernameAvailabilityCheckingError &&

                        <p className="auth-input__error">
                            {strings.usernameAvailabilityUnknownErr}
                        </p>
                    }

                    {this.renderValidationErrors(usernameErrors)}

                    <label className="auth-input__label">
                        {unauthPageStrings.passwordLabel}:
                    </label>
                    
                    {this.renderPasswordField()}
                    {this.renderValidationErrors(passwordErrors)}

                    <label className="auth-input__label">
                        {strings.repeatedPasswordLabel}:
                    </label>
                    
                    {this.renderRepeatedPasswordField()}
                    {this.renderValidationErrors(repeatedPasswordErrors)}

                    {this.renderSubmitButton()}
                </form>
            </section>
        );
    }

    componentWillReceiveProps(nextProps) {

        this.onUserCreationError(nextProps);
        this.onUserCreated(nextProps);
    }

    bindMethodsToThis() {

        this.validateUsername = this.validateUsername.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateRepeatedPassword = this.validateRepeatedPassword.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    renderUserCreationError() {

        const { userCreationError } = this.props;

        if (!userCreationError.responose) {

            return unauthPageStrings.unknownError;
        }

        const { status } = userCreationError.responose;

        if (status === 409) {

            return strings.usernameNotAvailableErr;
        } else if (status === 400) {

            return strings.validationError;
        }

        return unauthPageStrings.unknownError;
    }

    renderUsernameField() {

        const { usernameErrors, usernameAvailabilityChecking } = this.state;

        return (
            <div className="auth-input__wrapper">
                <input
                    type="text"
                    className={

                        classNames({
                            'auth-input': true,
                            'auth-input--invalid': (usernameErrors.length !== 0)
                        })
                    }

                    disabled={usernameAvailabilityChecking}
                    value={this.state.username}
                    onChange={this.updateInputValue('username')}
                    onBlur={this.validateUsername}
                />

                {
                    usernameAvailabilityChecking &&

                    <div className="auth-input__loading-animation">
                        <LoadingAnimation
                            width="30px"
                            height="30px"
                            thickness={5}
                        />
                    </div>
                }
            </div>
        );
    }

    renderPasswordField() {

        const { passwordErrors, fieldsDisabled } = this.state;

        return (
            <input
                type="password"
                className={

                    classNames({
                        'auth-input': true,
                        'auth-input--invalid': (passwordErrors.length !== 0)
                    })
                }

                disabled={fieldsDisabled}
                value={this.state.password}
                onChange={this.updateInputValue('password')}
                onBlur={this.validatePassword}
            />
        );
    }

    renderRepeatedPasswordField() {

        const { repeatedPasswordErrors, fieldsDisabled } = this.state;

        return (
            <input
                type="password"
                className={

                    classNames({
                        'auth-input': true,
                        'auth-input--invalid': (repeatedPasswordErrors.length !== 0)
                    })
                }

                disabled={fieldsDisabled}
                value={this.state.repeatedPassword}
                onChange={this.updateInputValue('repeatedPassword')}
                onBlur={this.validateRepeatedPassword}
            />
        );
    }

    renderValidationErrors(errors) {

        if (errors.length === 0) {

            return null;
        }

        const renderedErrors = errors.map((error, index) => (
            <li className="auth-input__error" key={index}>{error}</li>
        ));

        return (
            <ul className="auth-input__errors-list">
                {renderedErrors}
            </ul>
        );
    }

    renderSubmitButton() {

        const { usernameAvailabilityChecking } = this.state;

        return (
            <input
                type="submit"
                value={strings.registrationButtonText}
                className={

                    classNames({
                        'button': true,
                        'button--auth-submit': true,
                        'button--disabled': usernameAvailabilityChecking
                    })
                }
            />
        );
    }

    updateUsernameAvailabilityStatus(usernameAvailability) {

        const errors = [];

        if (!usernameAvailability.free) {

            errors.push(strings.usernameNotAvailableErr);
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

        if (username.length < 3 || username.length > 16) {

            errors.push(strings.usernameLengthErr);
        }

        if (/[^a-z0-9_]/i.test(username)) {

            errors.push(strings.usernameCharactersErr);
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

    checkingUsernameAvailabilitySucceeded(data) {

        this.setState({
            usernameAvailabilityChecking: false,
            usernameAvailabilityCheckingError: null,
            fieldsDisabled: false
        });
    }

    checkingUsernameAvailabilityFailed(err) {

        this.setState({
            usernameAvailabilityChecking: false,
            usernameAvailabilityCheckingError: err,
            fieldsDisabled: false
        });
    }

    validatePassword() {

        const errors = [];
        const { password } = this.state;

        if (password.length < 8 || password.length > 32) {

            errors.push(strings.passwordLengthErr);
        }

        if (!this.passwordContainsRequiredCharacters()) {

            errors.push(strings.passwordCharactersErr);
        }

        this.setState({
            passwordErrors: errors
        });

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

        if (password !== repeatedPassword) {

            errors.push(strings.passwordsEqualityErr);
        }

        this.setState({
            repeatedPasswordErrors: errors
        });

        return (errors.length === 0);
    }

    async submitForm(event) {

        event.preventDefault();

        if (!this.isFormValid()) {

            return;
        }

        this.disableFormFields();

        const { username, password } = this.state;
        const usernameAvailability = await this.usernameAvailabilityCheckingPromise;

        if (usernameAvailability && !usernameAvailability.free) {

            return;
        }

        this.props.createUser({ username, password });
    }

    disableFormFields() {

        this.setState({
            fieldsDisabled: true
        });
    }

    isFormValid() {
        
        const validUsername = this.validateUsername();
        const validPassword = this.validatePassword();
        const validRepeatedPassword = this.validateRepeatedPassword();  

        return (
            validUsername &&
            validPassword &&
            validRepeatedPassword
        );
    }

    onUserCreationError(nextProps) {

        if (nextProps.userCreationError && !this.props.userCreationError) {

            this.setState({
                password: '',
                repeatedPassword: '',
                usernameAvailabilityCheckingError: null
            });
        }
    }

    onUserCreated(nextProps) {

        if (nextProps.userCreated && !this.props.userCreated) {

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
    userCreationError: propTypes.instanceOf(Error)
};

RegistrationForm.defaultProps = {
    // redux
    userCreationError: null
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);