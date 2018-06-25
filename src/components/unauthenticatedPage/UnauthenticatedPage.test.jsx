import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from '../../store';
import UnauthenticatedPage from './UnauthenticatedPage';

describe('UnauthenticatedPage component', () => {

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <UnauthenticatedPage />
            </Provider>,

            document.createElement('div')
        );
    });
});