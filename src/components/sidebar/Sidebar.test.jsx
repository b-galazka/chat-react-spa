import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from '../../store';
import { putToken } from '../../actions/auth';
import Sidebar from './Sidebar';

describe('Sidebar component', () => {

    beforeAll(() => {

        store.dispatch(putToken('token', { username: 'username' }));
    });

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <Sidebar />
            </Provider>,

            document.createElement('div')
        );
    });
});