import React, { StrictMode } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { App } from './ui-demo/inject-load-error-module';


test('inject invalid module', async () => {
  render((
    <StrictMode>
      <App />
    </StrictMode>
  ))
  expect(screen.getByRole('loading')).toHaveTextContent('loading');
  try {
    await waitFor(() => screen.getByRole('app'))
  } catch (error) {
    expect(error.message.includes('Unable to find role="app"')).toBe(true);
  }
});