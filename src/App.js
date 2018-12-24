import React from 'react';
import Routes from './routes';
import ReactGA from 'react-ga';

function initializeReactGA() {
  ReactGA.initialize('UA-131339697-2');
  ReactGA.pageview('/home');
}

initializeReactGA();

export default () => <Routes />;