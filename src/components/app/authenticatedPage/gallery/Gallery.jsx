import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import classNames from 'classnames';

import LoadingAnimation from '@src/components/utils/loadingAnimation/LoadingAnimation';
import { closeGallery } from '@src/actions/ui';
import datePropValidator from '@src/utils/datePropValidator';

import sharedStyles from '@appComponent/shared.scss';
import styles from './gallery.scss';

function mapStateToProps(state) {

    return { image: state.ui.galleryImage };
}

function mapDispatchToProps(dispatch) {

    return {
        closeGallery: bindActionCreators(closeGallery, dispatch)
    };
}

class Gallery extends Component {

    constructor() {

        super();

        this.state = {
            isImageLoaded: false,
            isImageLoadingError: false
        };

        this.handleEscKey = this.handleEscKey.bind(this);
        this.handleLoadedImage = this.handleLoadedImage.bind(this);
        this.handleImageLoadingError = this.handleImageLoadingError.bind(this);
    }

    componentDidMount() {

        document.addEventListener('keydown', this.handleEscKey);
    }

    render() {

        // TODO: show footer with name and size of the original file

        return (
            <section
                className={
                    classNames({
                        [styles.gallery]: true,
                        [styles.galleryLoading]: !this.state.isImageLoaded
                    })
                }
            >
                {this.renderHeader()}
                {this.renderImage()}
            </section>
        );
    }

    renderHeader() {

        return (
            <header className={styles.galleryHeader}>
                <button
                    type="button"
                    onClick={this.props.closeGallery}

                    className={classNames(
                        styles.galleryCloseButton,
                        sharedStyles.buttonHamburger,
                        sharedStyles.buttonHamburgerCloseable
                    )}
                >
                </button>
            </header>
        );
    }

    renderImage() {

        const { t, image } = this.props;
        const { isImageLoaded, isImageLoadingError } = this.state;

        return (
            <div className={styles.galleryContent}>

                {
                    !isImageLoadingError &&

                    <img
                        src={image.url}
                        alt={t('gallery.imgAlt', { filename: image.name })}
                        className={styles.galleryImage}
                        onLoad={this.handleLoadedImage}
                        onError={this.handleImageLoadingError}
                    />
                }

                {
                    !isImageLoaded && !isImageLoadingError &&

                    <figure className={styles.galleryLoader}>
                        <LoadingAnimation color="#FFF" />
                    </figure>
                }

                {
                    isImageLoadingError &&
                    <p className={styles.galleryLoadingError}>{t('gallery.imgLoadingError')}</p>
                }
            </div>
        );
    }

    componentWillUnmount() {

        document.removeEventListener('keydown', this.handleEscKey);
    }

    handleEscKey({ key }) {

        if (key !== 'Escape' && key !== 'Esc') {

            return;
        }

        this.props.closeGallery();
    }

    handleLoadedImage() {

        this.setState({ isImageLoaded: true });
    }

    handleImageLoadingError() {

        this.setState({ isImageLoadingError: true });
    }
}

Gallery.propTypes = {
    // i18n
    t: propTypes.func.isRequired,

    // redux
    closeGallery: propTypes.func.isRequired,

    image: propTypes.shape({
        url: propTypes.string.isRequired,
        width: propTypes.number.isRequired,
        height: propTypes.number.isRequired,
        size: propTypes.number.isRequired,
        name: propTypes.string.isRequired,
        author: propTypes.shape({ username: propTypes.string.isRequired }).isRequired,
        date: datePropValidator('image.date validation error')
    }).isRequired
};

export default compose(withNamespaces(), connect(mapStateToProps, mapDispatchToProps))(Gallery);