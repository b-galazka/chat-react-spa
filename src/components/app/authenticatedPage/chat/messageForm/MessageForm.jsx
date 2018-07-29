import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import cuid from 'cuid';
import propTypes from 'prop-types';

import FormComponent from 'components/abstracts/FormComponent';

import { sendMessage, startTyping, finishTyping } from 'actions/messages';
import { startAttachmentUploading } from 'actions/messagesAttachments';

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
        startAttachmentUploading: bindActionCreators(startAttachmentUploading, dispatch)
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
        this.onFileInputValueChangeHandler = this.onFileInputValueChangeHandler.bind(this);
        this.onPasteHandler = this.onPasteHandler.bind(this);
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
                onPaste={this.onPasteHandler}
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
                    onChange={this.onFileInputValueChangeHandler}
                    ref={(ref) => { this.fileInputRef = ref; }}
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

    onFileInputValueChangeHandler({ target }) {

        const { files } = target;

        this.uploadFiles(files);
    }

    onPasteHandler({ clipboardData }) {

        const { files } = clipboardData;

        this.uploadFiles(files);
    }
    uploadFiles(files) {

        Array.prototype.forEach.call(files, (file) => {

            this.props.startAttachmentUploading(cuid(), file);
        });

        this.fileInputRef.value = '';
    }
}

MessageForm.propTypes = {
    // redux
    typingMessage: propTypes.bool.isRequired,
    sendMessage: propTypes.func.isRequired,
    startTyping: propTypes.func.isRequired,
    finishTyping: propTypes.func.isRequired,
    startAttachmentUploading: propTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageForm);