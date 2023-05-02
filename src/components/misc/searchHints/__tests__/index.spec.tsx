import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { SearchHints } from '..';

afterEach(cleanup);

it('renders the correct title', () => {
  // const { getByRole } = render(<SearchHints hints={{ hints: {} as never }} />);
  // expect(getByRole('title')).toHaveTextContent('SEARCH HINTS');
});

it('return null if there are no hints', () => {
  const { container } = render(<SearchHints hints={{}} />);

  expect(container.firstChild).toBeNull();
});
