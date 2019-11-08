import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { Signup } from '../Components/Signup';
import { doesNotReject } from 'assert';
// https://stackoverflow.com/questions/54842033/formik-form-submission-with-react-testing-library
// https://codesandbox.io/s/3vrjmrpr05
// https://kula.blog/posts/test_on_submit_in_react_testing_library/
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

const exampleSignup = {
  email: 'test123@test123.com',
  password: 'test123',
  passwordConfirm: 'test123',
};
const exampleSignup2 = {
  email: 'test123@test123',
  password: 'test123',
  passwordConfirm: 'test',
};

describe('<Signup />', () => {
  test('account creation form', () => {
    // mock function
    const onSubmit = jest.fn();

    const { getByLabelText, getByText, getByTestId } = render(
      <BrowserRouter>
        <Signup onSubmit={onSubmit}/>
      </BrowserRouter>
    );

    // use regex to make queries more resilient to small changes
    const emailInput = getByLabelText(/Enter your Email */i);
    fireEvent.change(emailInput, { target: { value: exampleSignup.email } });
    const passInput = getByLabelText(/Create a Password */i);
    fireEvent.change(passInput, { target: { value: exampleSignup.password } });
    const passCInput = getByLabelText(/Confirm Password */i);
    fireEvent.change(passCInput, {
      target: { value: exampleSignup.passwordConfirm },
    });

    fireEvent.click(getByText(/Submit/i)); // simulate click on submit button
    fireEvent.submit(getByTestId(/form/i)); // simulate form submit
    expect(onSubmit).toHaveBeenCalled();
    // expect(onSubmit).toHaveBeenCalledWith({
    //   emailInput,
    //   passInput,
    //   passCInput,
    // });
  });
});
