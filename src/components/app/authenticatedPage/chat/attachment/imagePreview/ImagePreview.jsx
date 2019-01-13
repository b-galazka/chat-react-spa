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

    render() {

        const { filename, previewUrl, t, author, username } = this.props;

        return (
            <div
                className={
                    classNames({
                        [styles.imagePreview]: true,
                        [styles.imagePreviewMy]: (author.username === username)
                    })
                }
            >
                <img
                    className={styles.imagePreviewImage}
                    src={previewUrl}
                    alt={t('imagePreview.imgAlt', { filename })}
                />
            </div>
        );
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