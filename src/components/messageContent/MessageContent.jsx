import React, { Component } from 'react';
import propTypes from 'prop-types';

class MessageContent extends Component {

    static get urlsRegex() {

        return /(https?|ftp):\/\/\S+/gi;
    }

    render() {

        const { children } = this.props;
        const messageContent = (Array.isArray(children)) ? children.join('') : children;

        if (!MessageContent.containsUrls(messageContent)) {

            return messageContent;
        }

        const messageContentArr = messageContent.split(' ');
        const output = MessageContent.injectLinks(messageContentArr);

        return output;
    }

    static containsUrls(messageContent) {

        const regex = MessageContent.urlsRegex;

        return (messageContent.search(regex) > -1);
    }

    static injectLinks(messageContentArr) {

        const regex = MessageContent.urlsRegex;

        return messageContentArr.reduce((output, contentPart, index, contentArray) => {
        
            const urls = contentPart.match(regex);

            if (!urls) {

                const nextContentPart = contentArray[index + 1];
                const isUrlNext = (nextContentPart && nextContentPart.search(regex) === 0);

                return MessageContent.pushText(output, contentPart, isUrlNext);
            }

            const [url] = urls;
            const textBeforeUrl = contentPart.substring(0, contentPart.indexOf(url));

            if (textBeforeUrl) {

                MessageContent.pushText(output, textBeforeUrl);
            }

            output.push(<a href={url} key={index} target="_blank">{url}</a>);

            return output;
        }, []);
    }

    static pushText(contentArray, text, endingSpace = false) {

        const prevContentPart = contentArray[contentArray.length - 1];
        const textToPush = (prevContentPart ? ' ' : '') + text + (endingSpace ? ' ' : '');

        if (prevContentPart && typeof prevContentPart === 'string') {

            contentArray[contentArray.length - 1] += textToPush;
        } else {

            contentArray.push(textToPush);
        }

        return contentArray;
    }
}

MessageContent.propTypes = {

    children: propTypes.oneOfType([
            propTypes.string,
            propTypes.arrayOf(propTypes.string)
        ]).isRequired
};

export default MessageContent;