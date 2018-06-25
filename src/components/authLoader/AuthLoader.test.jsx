import React from 'react';
import { render } from 'react-dom';

import AuthLoader from './AuthLoader';

describe('AuthLoader component', () => {

    it('should render without crash', () => {

        render(
            <AuthLoader />,
            document.createElement('div')
        );
    });
});