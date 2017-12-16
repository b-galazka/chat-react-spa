import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';
import cuid from 'cuid';

import {sendMessage} from '../../actions/messages';

import strings from './strings';

import './messageForm.scss';

function mapStateToProps(state) {

    return {};
}

function mapDispatchToProps(dispatch) {

    return {
        sendMessage: bindActionCreators(sendMessage, dispatch)
    };
}

class MessageForm extends Component {

    constructor() {

        super();

        this.state = {
            messageContent: ''
        };

        this.submitForm = this.submitForm.bind(this);
        this.updateMessageContent = this.updateMessageContent.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
    }

    render() {

        return (
            <form className="message-form" onSubmit={this.submitForm}>
                <textarea
                    className="message-form__textarea"
                    value={this.state.messageContent}
                    placeholder={strings.messageTextareaPlaceholder}
                    onChange={this.updateMessageContent}
                    onKeyDown={this.handleEnterKey}
                    ref={(ref) => {this.textareaRef = ref;}}
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

        const {messageContent} = this.state;

        return (messageContent.trim().length === 0);
    }

    updateMessageContent({target}) {

        const {value} = target;

        this.setState({
            messageContent: value
        });
    }

    resetMessageContent() {

        this.setState({
            messageContent: ''
        });
    }

    handleEnterKey(event) {

        if (!event.shiftKey && event.key === 'Enter') {

            event.preventDefault();

            this.submitForm();
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageForm);