import React from 'react';
import ReactDOM, {render, unmountComponentAtNode} from 'react-dom';
import {Provider} from 'react-redux';

import store from '../../store';
import AuthenticatedPage from './AuthenticatedPage';

describe('AuthenticatedPage component', () => {

    it('should render without crash', () => {

        const root = document.createElement('div');

        render(
            <Provider store={store}>
                <AuthenticatedPage />
            </Provider>,

            root
        );

        unmountComponentAtNode(root);
    });
});