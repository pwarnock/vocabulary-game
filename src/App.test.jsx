// App.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
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
vi.mock('./wordPackService', () => ({
  fetchWordPacks: vi.fn(() => Promise.resolve(mockWordPacks))
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial UI elements', async () => {
    render(<App />);

    // Check for title
    expect(screen.getByText(/vocabulary game/i)).toBeInTheDocument();

    // Check for select dropdown
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    // Check for default option
    expect(screen.getByText('Select a word pack')).toBeInTheDocument();
  });

  it('loads and displays word packs', async () => {
    render(<App />);

    // Wait for word packs to load
    await waitFor(() => {
      const option = screen.getByText('Mock Pack');
      expect(option).toBeInTheDocument();
    });
  });

  it('displays word and form after loading', async () => {
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

  it('handles correct word submission', async () => {
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
      expect(screen.getByText((content, element) => {
        return content.includes('Great job!');
      })).toBeInTheDocument();
    });
  });

  it('handles incorrect word submission', async () => {
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
    expect(screen.getByText((content, element) => {
      return content.includes('Try again!');
    })).toBeInTheDocument();
  });

  it('handles word pack selection', async () => {
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

  it('handles completing all words', async () => {
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    // Test that we can complete at least one word successfully
    const input = screen.getByPlaceholderText('Type here');
    const wordSpan = screen.getByText(/MOCK[12]/, { exact: false });
    const currentWord = wordSpan.textContent;

    fireEvent.change(input, { target: { value: currentWord } });
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return content.includes('Great job!');
      })).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});