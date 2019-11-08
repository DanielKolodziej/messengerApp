import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { Login } from '../Components/Login';

afterEach(cleanup);
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

const exampleLogin = {
  email: 'test123@test123.com',
  password: 'test123',
};

describe('<Login />', () => {
  test('account login form', () => {
    // mock function
    const onSubmit = jest.fn();

    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <Login onSubmit={onSubmit} />
      </BrowserRouter>
    );

    // use regex to make queries more resilient to small changes
    const emailInput = getByLabelText(/Enter your Email */i);
    fireEvent.change(emailInput, { target: { value: exampleLogin.email } });
    const passInput = getByLabelText(/Enter your Password */i);
    fireEvent.change(passInput, { target: { value: exampleLogin.password } });

    fireEvent.click(getByText(/Sign in/i)); // simulate click on sign in button
    // fireEvent.submit(getByLabelText())
    // expect(onSubmit).toHaveBeenCalledTimes(1);
    // expect(onSubmit).toHaveBeenCalledWith({
    //   emailInput,
    //   passInput,
    //   passCInput,
    // });
  });
});