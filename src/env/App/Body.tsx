import './index.css';

import type {FC} from 'react';
import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Providers, ProviderState} from '@microsoft/mgt-element';
import {Login} from '@microsoft/mgt-react';

import {CloudFilePicker} from '@/lib';

import type {RootState, AppDispatch} from './store';
import {loggedIn, logOut} from './components/authentication/authSlice';

const Body: FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.authentication.isLoggedIn);
    const token = useSelector((state: RootState) => state.authentication.accessToken);
    const dispatch = useDispatch() as AppDispatch;

    useEffect(() => {
        const updateState = () => {
            const provider = Providers.globalProvider;
            if (provider && provider.state === ProviderState.SignedOut) dispatch(logOut());
            else if (provider && provider.state === ProviderState.SignedIn) {
                Providers.globalProvider
                    .getAccessToken({scopes: ['files.readwrite', 'offline_access']})
                    .then(token => {
                        dispatch(loggedIn(token));
                    })
                    .catch(error => {
                        console.error('Error getting access token:', error);
                    });
            }
        };

        Providers.onProviderUpdated(updateState);
        updateState();

        return () => {
            Providers.removeProviderUpdatedListener(updateState);
        };
    }, [dispatch]);

    return (
        <div className="body">
            <div className={isLoggedIn ? 'header-hidden' : ''}>
                <Login />
            </div>
            {isLoggedIn && (
                <CloudFilePicker
                    accessToken={isLoggedIn ? token! : ''}
                    onConfirmSelection={() => {
                        alert('');
                    }}
                />
            )}
        </div>
    );
};

export default Body;
