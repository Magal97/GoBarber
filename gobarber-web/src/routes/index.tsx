import React from 'react';
import {Switch} from 'react-router-dom';

import SingIn from '../pages/SingIn';
import SingUp from '../pages/SingUp';
import DashBoard from '../pages/DashBoard';
import Route from './Route';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SingIn} />
    <Route path="/singup" exact component={SingUp} />
    <Route path="/dashboard" exact component={DashBoard} isPrivate />
  </Switch>
);


export default Routes;
