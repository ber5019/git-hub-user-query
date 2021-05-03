import { render } from '@testing-library/react';
import App from './App';

test('renders initial search input and button', () => {
  const { getByText, getByPlaceholderText } = render(<App />);
  const searchButton = getByText('Search');
  const searchInput = getByPlaceholderText('Enter User Search');
  expect(searchButton).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
});
