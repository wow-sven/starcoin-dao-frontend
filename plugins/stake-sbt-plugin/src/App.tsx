import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import { OverlayProvider } from './contexts/OverlayContext'
import { DaoProvider } from './contexts/DaoContext'
import { SubAppContext } from './root';
import Proposal from './pages/Proposal';

const App = () => {
  return (
    <SubAppContext.Consumer>
    {(appInfo) => {
      console.log("appInfo", appInfo);

      return (
        <ChakraProvider>
            <DaoProvider initDao={appInfo.dao}>
            <OverlayProvider>
              <Proposal/>
            </OverlayProvider>
          </DaoProvider>
        </ChakraProvider>
      )
    }}
    </SubAppContext.Consumer>
  )
};

export default App;
