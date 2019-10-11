import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import { Dashboard } from './Components/Dashboard';

const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
  apiKey: 'AIzaSyC_XhYWuIWW69sTfGqWHwEabpnfIigJWGI',
  authDomain: 'im-tutorial-99938.firebaseapp.com',
  databaseURL: 'https://im-tutorial-99938.firebaseio.com',
  projectId: 'im-tutorial-99938',
  storageBucket: 'im-tutorial-99938.appspot.com',
  messagingSenderId: '212111501035',
  appId: '1:212111501035:web:a24c2f1d0e3e396ae840ae',
});
const routing = (
  <Router>
    <div id="router-container">
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
