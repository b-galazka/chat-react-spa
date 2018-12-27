import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import propTypes from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';

import sharedStyles from '@appComponent/shared.scss';
import styles from './notFound.scss';

class NotFound extends Component {

    render() {

        const { t } = this.props;

        return (
            <div className={classNames(sharedStyles.page, styles.pageNotFound)}>
                <div className={styles.pageNotFoundWrapper}>
                    <h1 className={styles.pageNotFoundTitle}>{t('notFoundPage.header')}</h1>
                    <p className={styles.pageNotFoundDesc}>{t('notFoundPage.desc')}</p>

                    <Link to="/" className={classNames(sharedStyles.button, styles.buttonHomepage)}>
                        {t('notFoundPage.homepageButton')}
                    </Link>
                </div>
            </div>
        );
    }

    componentDidMount() {

        this.updatePageTitle();
    }

    updatePageTitle() {

        const { t } = this.props;

        document.title = t('pageTitle', { page: t('notFoundPage.pageTitle') });
    }
}

NotFound.propTypes = {
    // i18n
    t: propTypes.func.isRequired
};

export default compose(withNamespaces())(NotFound);