import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import cuid from 'cuid';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import FormComponent from '@src/components/abstracts/FormComponent';

import { sendMessage, startTyping, finishTyping } from '@src/actions/messages';
import { startAttachmentUploading } from '@src/actions/messagesAttachments';

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
        this.onDropHandler = this.onDropHandler.bind(this);
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

        const { t } = this.props;

        return (
            <textarea
                className="message-form__textarea"
                value={this.state.messageContent}
                placeholder={t('messageForm.textareaPlaceholder')}
                onChange={this.updateInputValue('messageContent')}
                onKeyDown={this.onKeyDownHandler}
                onPaste={this.onPasteHandler}
                onDragOver={MessageForm.preventFileBeingOpened}
                onDrop={this.onDropHandler}
                ref={(ref) => { this.textareaRef = ref; }}
                autoFocus
            >
            </textarea>
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

        const { t } = this.props;

        return (
            <button
                className={

                    classNames({
                        button: true,
                        'message-form__submit-button': true,
                        'button--disabled': this.isMessageEmpty()
                    })
                }
            >
                {t('messageForm.submitButtonText')}
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

    static preventFileBeingOpened(event) {

        event.preventDefault();
    }

    onFileInputValueChangeHandler({ target }) {

        const { files } = target;

        this.uploadFiles(files);
    }

    onPasteHandler({ clipboardData }) {

        const { files } = clipboardData;

        this.uploadFiles(files);
    }

    onDropHandler(event) {

        event.preventDefault();

        const { files } = event.dataTransfer;

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
    startAttachmentUploading: propTypes.func.isRequired,

    // i18n
    t: propTypes.func.isRequired
};

export default compose(
    withNamespaces(),
    connect(mapStateToProps, mapDispatchToProps)
)(MessageForm);