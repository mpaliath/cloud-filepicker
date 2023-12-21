import './index.css';

import type {FC} from 'react';

import Body from './Body';
import Header from './Header';

const App: FC = () => {
    return (
        <div className="app">
            <Header />
            <Body />
        </div>
    );
};

export default App;
