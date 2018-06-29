import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import cuid from 'cuid';
import propTypes from 'prop-types';

import FormComponent from '../abstracts/FormComponent';

import {
    sendMessage,
    startTyping,
    finishTyping,
    startFileUploading
} from '../../actions/messages';

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
        finishTyping: bindActionCreators(finishTyping, dispatch),
        startFileUploading: bindActionCreators(startFileUploading, dispatch)
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
        this.uploadFiles = this.uploadFiles.bind(this);
    }

    render() {

        return (
            <form className="message-form" onSubmit={this.submitForm}>
                {this.renderTextarea()}
                {this.renderFileUploadButton()}
                {this.renderSendMessageButton()}
            </form>
        );
    }

    renderTextarea() {

        return (
            <textarea
                className="message-form__textarea"
                value={this.state.messageContent}
                placeholder={strings.messageTextareaPlaceholder}
                onChange={this.updateInputValue('messageContent')}
                onKeyDown={this.onKeyDownHandler}
                ref={(ref) => { this.textareaRef = ref; }}
                autoFocus
            ></textarea>
        );
    }

    renderFileUploadButton() {

        return (
            <div className="message-form__file-upload-wrapper">
                <input
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={this.uploadFiles}
                />

                <label
                    htmlFor="fileUpload"
                    className="message-form__file-upload-button"
                >
                    <figure className="message-form__file-upload-icon"></figure>
                </label>
            </div>
        );
    }

    renderSendMessageButton() {

        return (
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
            tempId: cuid()
        });

        this.resetMessageContent();
        this.textareaRef.focus();
    }

    // TODO: add files upload onPaste and drag-and-drop
    uploadFiles({ target }) {

        const { files } = target;

        Array.prototype.forEach.call(files, (file) => {

            this.props.startFileUploading(cuid(), file);
        });
    }
}

MessageForm.propTypes = {
    // redux
    typingMessage: propTypes.bool.isRequired,
    sendMessage: propTypes.func.isRequired,
    startTyping: propTypes.func.isRequired,
    finishTyping: propTypes.func.isRequired,
    startFileUploading: propTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageForm);