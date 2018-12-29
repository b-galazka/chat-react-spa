import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import store from './store';
import i18n from './i18n';
import App from './components/app/App';

render(
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
            <App />
        </Provider>
    </I18nextProvider>,

    document.getElementById('root')
);

// TODO: add "keep me signed in"
// TODO: fix fetching prev messages on big screens
// TODO: replace componentWillUpdate with getSnapshotBeforeUpdate or componentDidUpdate