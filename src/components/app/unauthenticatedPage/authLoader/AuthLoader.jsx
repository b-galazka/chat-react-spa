import React from 'react';
import classNames from 'classnames';

import LoadingAnimation from '@src/components/utils/loadingAnimation/LoadingAnimation';

import sharedStyles from '@appComponent/shared.scss';
import styles from './authLoader.scss';

export default function AuthLoader() {

    return (
        <div className={classNames(sharedStyles.loader, styles.authLoader)}>
            <LoadingAnimation />
        </div>
    );
}