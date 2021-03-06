import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { compose } from 'redux';

import LoadingAnimation from '@src/components/utils/loadingAnimation/LoadingAnimation';

import sharedStyles from '@appComponent/shared.scss';

function mapStateToProps(state) {

    const { fetchingCurrentUserError, logoutError } = state.auth;

    return { fetchingCurrentUserError, logoutError };
}

class AppLoader extends Component {

    render() {

        const { fetchingCurrentUserError, logoutError } = this.props;

        return (
            <div className={sharedStyles.loader}>

                {
                    fetchingCurrentUserError || logoutError ?
                        <p className={sharedStyles.loaderError}>{this.renderErrorText()}</p> :
                        <LoadingAnimation />
                }

            </div>
        );
    }

    renderErrorText() {

        const { t } = this.props;

        if (this.props.fetchingCurrentUserError) {

            return t('fetchingError');
        }

        return t('loader.logoutError');
    }
}

AppLoader.propTypes = {
    // redux
    fetchingCurrentUserError: propTypes.instanceOf(Error),
    logoutError: propTypes.instanceOf(Error),

    // i18n
    t: propTypes.func.isRequired
};

AppLoader.defaultProps = {
    // redux
    fetchingCurrentUserError: null,
    logoutError: null
};

export default compose(withNamespaces(), connect(mapStateToProps))(AppLoader);