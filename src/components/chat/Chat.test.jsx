import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {Provider} from 'react-redux';

import store from '../../store';
import {putToken} from '../../actions/auth';
import Chat from './Chat';

describe('Chat component', () => {

    beforeAll(() => {

        store.dispatch(putToken('token', {username: 'username'}));
    });

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <Chat />
            </Provider>,

            document.createElement('div')
        );
    });
});