import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Trans } from 'react-i18next';


import styles from './authenticatedPageHeader.scss';

function mapStateToProps(state) {

    const { username } = state.auth.user;

    return { currentUserName: username };
}

function AuthenticatedPageHeader({ currentUserName }) {

    return (
        <header className={styles.authenticatedPageHeader}>
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
    currentUserName: propTypes.string.isRequired
};

export default connect(mapStateToProps)(AuthenticatedPageHeader);