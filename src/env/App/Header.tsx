import type {FC} from 'react';
import {Login} from '@microsoft/mgt-react';
import {useSelector} from 'react-redux';

import type {RootState} from './store';

const Header: FC = () => {
    const isLoggedIn = useSelector((state: RootState) => state.authentication.isLoggedIn);
    return (
        <div className="header">
            <div className={isLoggedIn ? 'header-right' : 'header-hidden'}>
                <Login />
            </div>
        </div>
    );
};

export default Header;
