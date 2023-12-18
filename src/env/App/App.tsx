import type {FC} from 'react';

import {CloudFilePicker} from '@/lib';
import './index.css';

const App: FC = () => {
    return (
        <div>
            Hello
            <CloudFilePicker
                accessToken=""
                onConfirmSelection={() => {
                    alert('');
                }}
            />
        </div>
    );
};

export default App;
