import React from 'react';
// import react testing methods
import { render, fireEvent, waitForElement } from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom/extend-expect';

// the axios mock is in __mocks__/
// see https://jestjs.io/docs/en/manual-mocks
import axiosMock from 'axios';

// the component to test
import { Chatlist } from '../Components/ChatList';

describe('<Chatlist />', () => {
  test('fn should generate a random number given a max input', () => {});
});
