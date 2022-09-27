import React from 'react';
import ReactDOM from 'react-dom';
import RootComponent from './root';
import { IDAO } from './extpoints/dao_app';

// 在首次加载和执行时会触发该函数
export const provider = (props) => {
   const root = props.dom
     ? props.dom.querySelector("#root")
     : document.querySelector("#root");

   console.log("provider props:", props);

   return {
     render() {
       ReactDOM.render(<RootComponent {...props} />, root);
     },
     destroy({ dom }) {
       ReactDOM.unmountComponentAtNode(
         dom ? dom.querySelector("#root") : document.querySelector("#root")
       );
     },
   };
};

export const setup = (dao: IDAO) => {
  console.log("plugin setup")

  dao.registerApp({
    name: "member_app",
    activeWhen: "/members",
    provider: (props) => {
      props.dao = {
        name: dao.name,
        address: dao.address,
        daoType: dao.daoType,
      }

      return provider(props)
    },
  })
}

export const teardown = () => {
  console.log("plugin teardown")
}

// 这能够让子应用独立运行起来，以保证后续子应用能脱离主应用独立运行，方便调试、开发
if (!window.__GARFISH__) {
  const dao = {
    name: "MOVEFUNSDAO",
    address: "0x2db2016e13bf7d307c4f9f100e3e4b10", 
    daoType: '0x2db2016e13bf7d307c4f9f100e3e4b10::MOVEFUNSDAO::MOVEFUNSDAO',
    registerApp: function(appInfo) {
      console.log("register App:", appInfo);
      
      const provider = appInfo.provider({
        basename: process.env.NODE_ENV === 'production' ? '/plugins/member-proposal-plugin' : '/',
        dom: document,
      });

      provider.render();
    }
  }

  setup(dao);
}
