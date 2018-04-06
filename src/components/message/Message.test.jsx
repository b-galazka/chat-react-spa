import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {Provider} from 'react-redux';

import store from '../../store';
import {putToken} from '../../actions/auth';
import Message from './Message';

describe('Message component', () => {

    beforeAll(() => {

        store.dispatch(putToken('token', {username: 'username'}));
    });

    it('should render without crash', () => {

        const messageObject = {
            id: 'id',
            author: { username: 'author' },
            content: 'content',
            date: new Date().toISOString()
        };

        render(
            <Provider store={store}>
                <Message message={messageObject} />
            </Provider>,

            document.createElement('div')
        );
    });
});