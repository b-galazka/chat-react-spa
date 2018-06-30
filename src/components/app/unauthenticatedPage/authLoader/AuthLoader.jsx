import React from 'react';

import LoadingAnimation from '../../loadingAnimation/LoadingAnimation';

import './authLoader.scss';

export default function AuthLoader() {

    return (
        <div className="page__loader page__loader--auth">
            <LoadingAnimation />
        </div>
    );
}