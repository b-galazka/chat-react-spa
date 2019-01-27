import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import classNames from 'classnames';

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

        this.handleEscKey = this.handleEscKey.bind(this);
    }

    componentDidMount() {

        document.addEventListener('keydown', this.handleEscKey);
    }

    render() {

        // TODO: show original image
        // TODO: show footer with name and size of the original file

        return (
            <section className={styles.gallery}>
                {this.renderHeader()}
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

    componentWillUnmount() {

        document.removeEventListener('keydown', this.handleEscKey);
    }

    handleEscKey(event) {

        if (event.key !== 'Escape') {

            return;
        }

        this.props.closeGallery();
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