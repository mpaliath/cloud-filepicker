import './index.css';

import type {FC} from 'react';
import {FluentProvider, webLightTheme} from '@fluentui/react-components';

import Body from './Body';
import Header from './Header';

const App: FC = () => {
    return (
        <FluentProvider theme={webLightTheme}>
            <div className="app">
                <Header />
                <Body />
            </div>
        </FluentProvider>
    );
};

export default App;
