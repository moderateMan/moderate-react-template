import React, { StrictMode } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { App } from './ui-demo/inject-invalid-module';

test('inject invalid module', async () => {
  render((
    <StrictMode>
      <App />
    </StrictMode>
  ))
  expect(screen.getByRole('app')).toHaveTextContent('app');
  expect(screen.getByRole('name')).toHaveTextContent('undefined');
});
