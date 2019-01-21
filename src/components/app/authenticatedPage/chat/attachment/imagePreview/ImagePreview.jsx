import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { openGallery } from '@src/actions/ui';
import datePropValidator from '@src/utils/datePropValidator';

import styles from './imagePreview.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;

    return { username };
}

function mapDispatchToProps(dispatch) {

    return {
        openGallery: bindActionCreators(openGallery, dispatch)
    };
}

class ImagePreview extends Component {

    constructor() {

        super();

        this.openGallery = this.openGallery.bind(this);
    }

    render() {

        const { t, username, attachment } = this.props;

        return (
            <div
                className={
                    classNames({
                        [styles.imagePreview]: true,
                        [styles.imagePreviewMy]: (attachment.author.username === username)
                    })
                }
            >
                <div className={styles.imagePreviewWrapper} onClick={this.openGallery}>
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
            </div>
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

    openGallery() {

        const { urls, metadata, ...attachment } = this.props.attachment;
        const { width, height } = metadata.originalFile;

        this.props.openGallery({
            ...attachment,
            url: urls.originalFile,
            width,
            height
        });
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
                height: propTypes.number.isRequired
            })
        }).isRequired,

        author: propTypes.shape({ username: propTypes.string.isRequired }).isRequired,
        date: datePropValidator('attachment.date validation error'),
        name: propTypes.string.isRequired,
        size: propTypes.number.isRequired
    }).isRequired,

    // i18n
    t: propTypes.func.isRequired,

    // redux
    username: propTypes.string.isRequired,
    openGallery: propTypes.func.isRequired
};

export default compose(
    withNamespaces(),
    connect(mapStateToProps, mapDispatchToProps)
)(ImagePreview);