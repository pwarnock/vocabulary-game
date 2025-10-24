import React, { useEffect, useState, useCallback, useRef } from 'react';
import { fetchWordPacks } from './wordPackService';

function App() {
  const [wordPacks, setWordPacks] = useState([]); 
  const [selectedPack, setSelectedPack] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [completedWords, setCompletedWords] = useState([]);
  const hasLoaded = useRef(false);

  const getNextWord = useCallback(() => {
    if (words.length === 0) return; // Don't proceed if no words are available

    const availableWords = words.filter(word => !completedWords.includes(word));

    if (availableWords.length === 0) {
      setCompletedWords([]);
      setMessage("All words completed! Starting over...");
      // After resetting completedWords, select from all words again
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
      return;
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
  }, [words, completedWords]);

  // Fetch word packs on component mount
  useEffect(() => {
    const loadWordPacks = async () => {
      try {
        const packs = await fetchWordPacks();
        setWordPacks(packs || []);
        if (packs && packs.length > 0) {
          setSelectedPack(packs[0]);
          setWords(packs[0].words || []);
        }
      } catch (error) {
        console.error('Error loading word packs:', error);
        setMessage('Error loading word packs');
      }
    };

    loadWordPacks();
  }, []);

  // Effect to set initial word when words are loaded
  useEffect(() => {
    if (words.length > 0 && !hasLoaded.current) {
      getNextWord();
      hasLoaded.current = true;
    }
  }, [words, getNextWord]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.toUpperCase() === currentWord) {
      setMessage("Great job!");
      setCompletedWords(prev => [...prev, currentWord]);
      setInputValue("");

      setTimeout(() => {
        getNextWord();
        setMessage("");
      }, 1000);
    } else {
      setMessage("Try again!");
    }
  };

  const handlePackChange = (e) => {
    const selected = wordPacks.find(pack => pack.id === parseInt(e.target.value));
    if (selected) {
      // Update all related states in a single batch
      setSelectedPack(selected);
      setCompletedWords([]); // Reset completed words
      setWords(selected.words || []); // Set new words
      // Immediately select a new word from the new pack
      const randomWord = selected.words[Math.floor(Math.random() * selected.words.length)];
      setCurrentWord(randomWord);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-2xl font-bold mb-4">Vocabulary Game</h1>
      <select 
        onChange={handlePackChange} 
        className="mb-4"
        value={selectedPack?.id || ''}
      >
        <option value="" disabled>Select a word pack</option>
        {Array.isArray(wordPacks) && wordPacks.map(pack => (
          <option key={pack.id} value={pack.id}>{pack.name}</option>
        ))}
      </select>
      {currentWord && (
        <>
          <p className="text-lg mb-2">Type the word: <span className="font-semibold">{currentWord}</span></p>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="border border-gray-400 p-2 rounded"
              placeholder="Type here"
            />
            <button type="submit" className="ml-2 bg-green-500 text-white p-2 rounded">
              Submit
            </button>
          </form>
        </>
      )}
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  );
}

export default App;