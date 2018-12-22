import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './components/app/App';

render(
    <Provider store={store}>
        <App />
    </Provider>,

    document.getElementById('root')
);

// TODO: improve sign out
// TODO: implement react-i18next
// TODO: add "keep me signed in"
// TODO: add eslint
// TODO: reorganize styles