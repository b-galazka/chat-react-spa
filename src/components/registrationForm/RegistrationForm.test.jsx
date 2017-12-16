import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {Provider} from 'react-redux';

import store from '../../store';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm component', () => {

    it('should render without crash', () => {

        render(
            <Provider store={store}>
                <RegistrationForm />
            </Provider>,

            document.createElement('div')
        );
    });
});