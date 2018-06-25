import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from '../../store';
import AuthenticatedPageLoader from './AuthenticatedPageLoader';

describe('AuthenticatedPageLoader component', () => {

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <AuthenticatedPageLoader />
            </Provider>,

            document.createElement('div')
        );
    });
});