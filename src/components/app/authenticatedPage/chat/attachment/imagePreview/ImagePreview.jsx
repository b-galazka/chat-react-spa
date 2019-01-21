import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';

import styles from './imagePreview.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;

    return { username };
}

class ImagePreview extends Component {

    constructor() {

        super();

        this.state = { isFullscreen: false };

        this.enableFullscreen = this.enableFullscreen.bind(this);
        this.disableFullscreen = this.disableFullscreen.bind(this);
    }

    render() {

        const { t, username, attachment } = this.props;
        const { isFullscreen } = this.state;

        return (
            <div
                className={
                    classNames({
                        [styles.imagePreview]: true,
                        [styles.imagePreviewMy]: (attachment.author.username === username)
                    })
                }
            >
                <div className={styles.imagePreviewWrapper} onClick={this.enableFullscreen}>
                    <figure
                        className={styles.imagePreviewContainer}
                        style={this.getImageWrapperDimensions()}
                    >
                        <img
                            className={styles.imagePreviewImage}
                            src={attachment.urls.preview || attachment.urls.originalFile}
                            alt={t('imagePreview.imgAlt', { filename: attachment.name })}
                        />
                    </figure>
                </div>

                { isFullscreen && this.renderFullscreenPreview() }
            </div>
        );
    }

    renderFullscreenPreview() {

        // TODO: show original image
        // TODO: show footer with name and size of the original file
        // TODO: render fullscreen outside of this component?
        // TODO: add current fullscreen preview image to store?

        return (
            <div className={styles.imagePreviewFullscreen} onClick={this.disableFullscreen}></div>
        );
    }

    getImageWrapperDimensions() {

        const { metadata } = this.props.attachment;
        const { width, height } = metadata.preview || metadata.originalFile;

        return {
            width: `${width}px`,
            paddingTop: `${height / width * 100}%`
        };
    }

    enableFullscreen() {

        this.setState({ isFullscreen: true });
    }

    disableFullscreen() {

        this.setState({ isFullscreen: false });
    }
}

ImagePreview.propTypes = {
    attachment: propTypes.shape({
        urls: propTypes.shape({
            originalFile: propTypes.string.isRequired,
            preview: propTypes.string
        }).isRequired,

        metadata: propTypes.shape({
            originalFile: propTypes.shape({
                width: propTypes.number.isRequired,
                height: propTypes.number.isRequired
            }).isRequired,

            preview: propTypes.shape({
                width: propTypes.number.isRequired,
                height: propTypes.number.isRequired,
                size: propTypes.number.isRequired
            })
        }).isRequired,

        author: propTypes.shape({ username: propTypes.string.isRequired }).isRequired,
        name: propTypes.string.isRequired,
        size: propTypes.number.isRequired
    }).isRequired,

    // i18n
    t: propTypes.func.isRequired,

    // redux
    username: propTypes.string.isRequired
};

export default compose(withNamespaces(), connect(mapStateToProps))(ImagePreview);