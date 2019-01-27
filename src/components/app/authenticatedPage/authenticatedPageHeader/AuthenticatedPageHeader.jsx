import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import { toggleMobileSidebar } from '@src/actions/ui';

import sharedStyles from '@appComponent/shared.scss';
import styles from './authenticatedPageHeader.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;
    const { isMobileSidebarOpened } = state.ui;

    return { currentUserName: username, isMobileSidebarOpened };
}

function mapDispatchToProps(dispatch) {

    return {
        toggleMobileSidebar: bindActionCreators(toggleMobileSidebar, dispatch)
    };
}

function AuthenticatedPageHeader({ currentUserName, toggleMobileSidebar, isMobileSidebarOpened }) {

    return (
        <header className={styles.authenticatedPageHeader}>
            <button
                type="button"
                onClick={toggleMobileSidebar}

                className={
                    classNames({
                        [sharedStyles.buttonHamburger]: true,
                        [styles.authenticatedPageHeaderMobileSidebarTrigger]: true,
                        [sharedStyles.buttonHamburgerCloseable]: isMobileSidebarOpened
                    })
                }
            >
                <span></span>
            </button>

            <p className={styles.authenticatedPageHeaderText}>
                <Trans i18nKey="authenticatedPageHeader.loggedAs" >
                    You are logged as
                    <span className={styles.authenticatedPageHeaderCurrentUserName}>
                        {{ username: currentUserName }}
                    </span>
                </Trans>
            </p>
        </header>
    );
}

AuthenticatedPageHeader.propTypes = {
    // redux
    currentUserName: propTypes.string.isRequired,
    toggleMobileSidebar: propTypes.func.isRequired,
    isMobileSidebarOpened: propTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedPageHeader);