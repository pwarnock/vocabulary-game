// App.test.js
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock data that matches your implementation
const mockWordPacks = [
  {
    id: 1,
    name: 'Mock Pack',
    words: ['MOCK1', 'MOCK2']
  }
];

// Mock the service
jest.mock('./wordPackService', () => ({
  fetchWordPacks: jest.fn().mockResolvedValue(mockWordPacks)
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial UI elements', async () => {
    render(<App />);

    // Check for title
    expect(screen.getByText(/vocabulary game/i)).toBeInTheDocument();

    // Check for select dropdown
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // Check for default option
    expect(screen.getByText('Select a word pack')).toBeInTheDocument();
  });

  test('loads and displays word packs', async () => {
    render(<App />);

    // Wait for word packs to load
    await waitFor(() => {
      const option = screen.getByText('Mock Pack');
      expect(option).toBeInTheDocument();
    });
  });

  test('displays word and form after loading', async () => {
    render(<App />);

    // Wait for the word display to appear
    await waitFor(() => {
      const wordPrompt = screen.getByText(/type the word:/i);
      expect(wordPrompt).toBeInTheDocument();
    });

    // Check for input field and submit button
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('handles correct word submission', async () => {
    render(<App />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    // Get the current word
    const wordSpan = screen.getByText(/MOCK[12]/, { exact: false });
    const currentWord = wordSpan.textContent;

    // Fill in the input
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: currentWord } });

    // Submit the form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Great job!')).toBeInTheDocument();
    });
  });

  test('handles incorrect word submission', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    // Fill in wrong input
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'WRONG' } });

    // Submit the form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Check for error message
    expect(screen.getByText('Try again!')).toBeInTheDocument();
  });

  test('handles word pack selection', async () => {
    render(<App />);

    // Wait for word packs to load
    await waitFor(() => {
      expect(screen.getByText('Mock Pack')).toBeInTheDocument();
    });

    // Change pack selection
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    // Verify that a word is displayed
    await waitFor(() => {
      const wordPrompt = screen.getByText(/type the word:/i);
      expect(wordPrompt).toBeInTheDocument();
    });
  });

  test('handles completing all words', async () => {
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    // Complete all words in the pack
    for (const word of mockWordPacks[0].words) {
      const input = screen.getByPlaceholderText('Type here');
      fireEvent.change(input, { target: { value: word } });

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Great job!')).toBeInTheDocument();
      });
    }

    // Check for completion message
    await waitFor(() => {
      expect(screen.getByText('All words completed! Starting over...')).toBeInTheDocument();
    });
  });
});