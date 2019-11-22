import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Dashboard } from '../Components/Dashboard';

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
//  Warning: <BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }`
// Arrange, Act, Assert
describe('<Dashboard />', () => {
  test('loads user dashboard', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/dashboard'],
    });

    const { findByText } = render(
      <Router history={history}>
        <Dashboard history={history} />
      </Router>
    );
    // expect(history.location.pathname).toBe('/dashboard');
    // axios.get.mockImplementation(() => Promise.resolve(testInfo));
    // axios.get.mockResolvedValue(testInfo);
    // await wait(() => expect(container.textContent).toContain(/out/i));
    // expect(container).toBeDefined();
    // const signOutBtn = await waitForElement(() => findByText(/out/i));
  });
});
