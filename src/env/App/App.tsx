import './index.css';

import type {FC} from 'react';
import {useState, useEffect} from 'react';
import {Providers, ProviderState} from '@microsoft/mgt-element';
import {Login} from '@microsoft/mgt-react';

import {CloudFilePicker} from '@/lib';

const App: FC = () => {
    const [accessToken, setAccessToken] = useState<string>('');

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const updateState = () => {
            const provider = Providers.globalProvider;
            setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
        };

        Providers.onProviderUpdated(updateState);
        updateState();

        return () => {
            Providers.removeProviderUpdatedListener(updateState);
        };
    }, []);

    useEffect(() => {
        if (Providers.globalProvider.state === ProviderState.SignedIn) {
            Providers.globalProvider
                .getAccessToken({scopes: ['files.readwrite', 'offline_access']})
                .then(token => {
                    setAccessToken(token);
                })
                .catch(error => {
                    console.error('Error getting access token:', error);
                });
        } else if (Providers.globalProvider.state === ProviderState.SignedOut) {
            setAccessToken('');
        }
    }, [isSignedIn]);

    return (
        <div className="app">
            <header>
                <Login />
            </header>
            {accessToken && (
                <CloudFilePicker
                    accessToken={accessToken ?? ''}
                    onConfirmSelection={() => {
                        alert('');
                    }}
                />
            )}
        </div>
    );
};

export default App;
