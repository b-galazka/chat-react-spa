import React, { Component } from 'react';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { closeGallery } from '@src/actions/ui';

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

    render() {

        // TODO: show original image
        // TODO: show footer with name and size of the original file

        return (
            <section className={styles.gallery} onClick={this.props.closeGallery}>

            </section>
        );
    }
}

Gallery.propTypes = {
    // TODO: add proptypes


    // i18n
    t: propTypes.func.isRequired,

    // redux
    closeGallery: propTypes.func.isRequired
};

export default compose(withNamespaces(), connect(mapStateToProps, mapDispatchToProps))(Gallery);