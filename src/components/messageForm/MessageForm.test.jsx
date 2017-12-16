import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {Provider} from 'react-redux';

import store from '../../store';
import MessageForm from './MessageForm';

describe('MessageForm component', () => {

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <MessageForm />
            </Provider>,

            document.createElement('div')
        );
    });
});