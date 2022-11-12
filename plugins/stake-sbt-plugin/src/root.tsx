import React, {createContext} from 'react';
import {PropsInfo} from '@garfish/bridge-react';
import {
    BrowserRouter,
    MemoryRouter,
} from 'react-router-dom';
import App from './App';
import './App.less';

export const prefixCls = 'sub-app-react16';
export const SubAppContext = createContext<PropsInfo>({} as PropsInfo);

const RootComponent = (appInfo) => {
    return (
        <SubAppContext.Provider value={{...appInfo}}>
            {location.pathname.includes('loadApp') ? (
                <MemoryRouter>
                    <App/>
                </MemoryRouter>
            ) : (
                <BrowserRouter basename={appInfo.basename}>
                    <App/>
                </BrowserRouter>
            )}
        </SubAppContext.Provider>
    );
};

export default RootComponent;
