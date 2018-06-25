import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from '../../store';
import LoginForm from './LoginForm';

describe('LoginForm component', () => {

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <LoginForm />
            </Provider>,

            document.createElement('div')
        );
    });
});