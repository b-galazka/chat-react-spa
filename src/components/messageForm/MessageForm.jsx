import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import cuid from 'cuid';
import propTypes from 'prop-types';

import FormComponent from '../abstracts/FormComponent';

import { sendMessage, startTyping, finishTyping } from '../../actions/messages';

import strings from './strings';

import './messageForm.scss';

function mapStateToProps(state) {

    const { typingMessage } = state.messages;

    return { typingMessage };
}

function mapDispatchToProps(dispatch) {

    return {
        sendMessage: bindActionCreators(sendMessage, dispatch),
        startTyping: bindActionCreators(startTyping, dispatch),
        finishTyping: bindActionCreators(finishTyping, dispatch)
    };
}

class MessageForm extends FormComponent {

    constructor() {

        super();

        this.state = {
            messageContent: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    }

    render() {

        return (
            <form className="message-form" onSubmit={this.submitForm}>
                <textarea
                    className="message-form__textarea"
                    value={this.state.messageContent}
                    placeholder={strings.messageTextareaPlaceholder}
                    onChange={this.updateInputValue('messageContent')}
                    onKeyDown={this.onKeyDownHandler}
                    ref={(ref) => { this.textareaRef = ref; }}
                    autoFocus
                ></textarea>

                <button
                    className={

                        classNames({
                            'button': true,
                            'message-form__submit-button': true,
                            'button--disabled': this.isMessageEmpty()
                        })
                    }
                >
                    {strings.submitButtonText}
                </button>
            </form>
        );
    }

    isMessageEmpty() {

        const { messageContent } = this.state;

        return (messageContent.trim().length === 0);
    }

    resetMessageContent() {

        this.setState({
            messageContent: ''
        });
    }

    onKeyDownHandler(event) {

        const { startTyping, finishTyping, typingMessage } = this.props;

        if (!event.shiftKey && event.key === 'Enter') {

            event.preventDefault();

            finishTyping();
            this.submitForm();

            return;
        }

        if (!typingMessage) {

            startTyping();
        }

        finishTyping(700);
    }

    submitForm(event) {

        if (event) {

            event.preventDefault();
        }

        if (this.isMessageEmpty()) {

            return;
        }

        this.props.sendMessage({
            content: this.state.messageContent.trim(),
            tempID: cuid()
        });

        this.resetMessageContent();
        this.textareaRef.focus();
    }
}

MessageForm.propTypes = {
    // redux
    typingMessage: propTypes.bool.isRequired,
    sendMessage: propTypes.func.isRequired,
    startTyping: propTypes.func.isRequired,
    finishTyping: propTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageForm);