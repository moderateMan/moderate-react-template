import React, { StrictMode } from 'react'
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { App } from './ui-demo/inject-deep';

test('inject normal', async () => {
  render((
    <StrictMode>
      <App />
    </StrictMode>
  ))
  expect(screen.getByRole('name-input')).toHaveValue('son name');
  expect(screen.getByRole('count')).toHaveTextContent('0');
  expect(screen.getByRole('text-split')).toHaveTextContent('son name'.split('').join(','));
})