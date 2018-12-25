import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import propTypes from 'prop-types';

import './notFound.scss';
import { compose } from 'redux';

class NotFound extends Component {

    render() {

        const { t } = this.props;

        return (
            <div className="page page--not-found">
                <div className="page__wrapper--not-found">
                    <h1 className="page__title--not-found">{t('notFoundPage.header')}</h1>
                    <p className="page__desc--not-found">{t('notFoundPage.desc')}</p>

                    <Link to="/" className="button button--homepage">
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