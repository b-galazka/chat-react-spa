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

        const { filename, previewUrl, t, author, username } = this.props;
        const { isFullscreen } = this.state;

        return (
            <div
                className={
                    classNames({
                        [styles.imagePreview]: true,
                        [styles.imagePreviewMy]: (author.username === username)
                    })
                }
            >
                <div className={styles.imagePreviewWrapper} onClick={this.enableFullscreen}>
                    <img
                        className={styles.imagePreviewImage}
                        src={previewUrl}
                        alt={t('imagePreview.imgAlt', { filename })}
                    />
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

    enableFullscreen() {

        this.setState({ isFullscreen: true });
    }

    disableFullscreen() {

        this.setState({ isFullscreen: false });
    }
}

ImagePreview.propTypes = {
    previewUrl: propTypes.string.isRequired,
    originalFileUrl: propTypes.string.isRequired,
    filename: propTypes.string.isRequired,
    size: propTypes.number.isRequired,
    author: propTypes.shape({ username: propTypes.string.isRequired }).isRequired,

    // i18n
    t: propTypes.func.isRequired,

    // redux
    username: propTypes.string.isRequired
};

export default compose(withNamespaces(), connect(mapStateToProps))(ImagePreview);