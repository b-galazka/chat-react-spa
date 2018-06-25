import React from 'react';
import { render } from 'react-dom';

import LoadingAnimation from './LoadingAnimation';

describe('LoadingAnimation component', () => {

    it('should render without crash', () => {

        render(
            <LoadingAnimation />,
            document.createElement('div')
        );
    });
});