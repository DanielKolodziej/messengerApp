import React, { useEffect } from 'react';
import { render, cleanup, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { Dashboard } from '../Components/Dashboard';

// jest.mock('axios');
// jest.mock('../Components/Dashboard', () => ({
//   getUserData: jest.fn(() => )
// }));
// jest.mock(Dashboard.getUserData);

afterEach(() => {
  jest.resetAllMocks();
  return cleanup;
});
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
//  Warning: <BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }`
// Arrange, Act, Assert
describe('<Dashboard />', () => {
  test('loads and renders user dashboard', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/dashboard'],
    });
    const testInfo = { email: 'qwe@qwe.com' };
    // axios.get.mockResolvedValueOnce(testInfo.email);

    // Dashboard.getUserData.mockResolvedValueOnce(testInfo.email);

    const { findByText, container, debug } = render(
      <Router history={history}>
        <Dashboard history={history} />
      </Router>
    );
    debug();
    expect(history.location.pathname).toBe('/dashboard');
    expect(container).toHaveTextContent(/loading/i);

    // expect(Dashboard.getUserData).toHaveBeenCalledTimes(1);
    // await wait(() => expect(container).toHaveTextContent(/out/i));
    // const logBtn = await findByText(/out/i);

    // axios.get.mockImplementation(() => Promise.resolve(testInfo));
    // axios.get.mockResolvedValue(testInfo);
    // await wait(() => expect(container.textContent).toContain(/out/i));
  });
});
