import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './landing'
import Home from './home';
import Info from './info';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/home" exact component={Home} />
    </Switch>
  </BrowserRouter>
);
