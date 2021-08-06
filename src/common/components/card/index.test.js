import { render, screen } from '@testing-library/react';
import Com from './index';

test('renders learn react link', () => {
  render(<Com />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
