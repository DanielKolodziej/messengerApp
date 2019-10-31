import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { Signup } from '../Components/Signup';

afterEach(cleanup);

describe('<Signup />', () => {
  test('displays the form', () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
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
    const emailInput = getByLabelText('Enter your Email *');
    emailInput.value = exampleSignup.email;
    const passInput = getByLabelText('Create a Password *');
    passInput.value = exampleSignup.password;
    const passCInput = getByLabelText('Confirm Password *');
    passCInput.value = exampleSignup.passwordConfirm;

    const submitBtn = getByText('Submit');
    expect(fireEvent.click(submitBtn)).toBeTruthy();
    // expect(fireEvent.click(submitBtn)).toBeTruthy();
  });
});
