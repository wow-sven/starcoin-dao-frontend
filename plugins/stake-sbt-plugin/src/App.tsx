import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { OverlayProvider } from './contexts/OverlayContext'
import { DaoProvider } from './contexts/DaoContext'
import { SubAppContext } from './root';
import Router from "./router/routes";

const App = () => {
  return (
    <SubAppContext.Consumer>
    {(appInfo) => {
      console.log("appInfo", appInfo);

      return (
        <ChakraProvider>
            <DaoProvider initDao={appInfo.dao}>
            <OverlayProvider>
                <Router/>
            </OverlayProvider>
          </DaoProvider>
        </ChakraProvider>
      )
    }}
    </SubAppContext.Consumer>
  )
};

export default App;
