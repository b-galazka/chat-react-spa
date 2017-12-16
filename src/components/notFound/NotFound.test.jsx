import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import NotFound from './NotFound';

describe('NotFound component', () => {

    it('should render without crash', () => {

        render(
            <BrowserRouter>
                <NotFound />
            </BrowserRouter>,
            
            document.createElement('div')
        );
    });
});