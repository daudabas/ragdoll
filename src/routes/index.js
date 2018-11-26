import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Greetings from './greetings'
import Home from './home';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Greetings} />
      <Route path="/home" exact component={Home} />
    </Switch>
  </BrowserRouter>
);
