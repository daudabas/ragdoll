import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './landing'
import Home from './home';
import Face from './face';


export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/home" exact component={Home} />
      <Route path="/home/:id" exact component={Home} />
      <Route path="/camera" exact component={Face} />
    </Switch>
  </BrowserRouter>
);
