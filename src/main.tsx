import React from 'react';
import ReactDOM from 'react-dom/client';
import {Providers} from '@microsoft/mgt-element';
import {Msal2Provider} from '@microsoft/mgt-msal2-provider';
import {Provider} from 'react-redux';

import App from '@/env/App/App';

import {store} from './env/App/store';

Providers.globalProvider = new Msal2Provider({clientId: '5cf21436-2a20-447b-b222-77a1326409bb'});

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
