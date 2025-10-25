import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWordPacks } from './wordPackService';
import './App.css';

function App() {
  const [wordPacks, setWordPacks] = useState([]); 
  const [selectedPack, setSelectedPack] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [completedWords, setCompletedWords] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [isKindergarten, setIsKindergarten] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const hasLoaded = useRef(false);

  // Visual hints for kindergarten words
  const hints = {
    "Red": "🔴", "Blue": "🔵", "Yellow": "🟡", "Green": "🟢",
    "Cat": "🐱", "Dog": "🐕", "Bird": "🐦", "Fish": "🐟",
    "Mom": "👩", "Dad": "👨", "Baby": "👶", "Home": "🏠",
    "Play": "🎮", "Read": "📚", "Friend": "👫", "Fun": "😊",
    "Milk": "🥛", "Cake": "🎂", "Juice": "🧃", "Book": "📖",
    "Sun": "☀️", "Moon": "🌙", "Star": "⭐", "Tree": "🌳"
  };

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

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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
    // Support mixed case for kindergarten - case insensitive comparison
    const isCorrect = isKindergarten 
      ? inputValue.toLowerCase() === currentWord.toLowerCase()
      : inputValue.toUpperCase() === currentWord;
    
    if (isCorrect) {
      setMessage("Great job! 🎉");
      setCompletedWords(prev => [...prev, currentWord]);
      setInputValue("");
      setShowHint(false);

      setTimeout(() => {
        getNextWord();
        setMessage("");
      }, 1500);
    } else {
      setMessage("Try again! 🤔");
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
      setShowInstallButton(false);
    } else {
      console.log('PWA installation dismissed');
    }
    
    setDeferredPrompt(null);
  };

  const handlePackChange = (e) => {
    const selected = wordPacks.find(pack => pack.id === parseInt(e.target.value));
    if (selected) {
      // Update all related states in a single batch
      setSelectedPack(selected);
      setCompletedWords([]); // Reset completed words
      setWords(selected.words || []); // Set new words
      setIsKindergarten(selected.id === 4); // Check if kindergarten pack
      setShowHint(false); // Reset hint when changing packs
      // Immediately select a new word from the new pack
      const randomWord = selected.words[Math.floor(Math.random() * selected.words.length)];
      setCurrentWord(randomWord);
    }
  };

return (
    <motion.div 
      className={`flex flex-col items-center justify-center h-screen ${isKindergarten ? 'kindergarten-mode' : 'bg-blue-100'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* PWA Install Button */}
      <AnimatePresence>
        {showInstallButton && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleInstallClick}
            className="install-button mb-4"
            aria-label="Install app"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📱 Install App
          </motion.button>
        )}
      </AnimatePresence>
      
      <motion.h1 
        className={`text-2xl font-bold mb-4 ${isKindergarten ? 'text-white' : ''}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      >
        {isKindergarten ? '🌟 Kindergarten Fun 🌟' : 'Vocabulary Game'}
      </motion.h1>
      
      <motion.select
        onChange={handlePackChange} 
        className={`mb-4 ${isKindergarten ? 'kindergarten-select' : ''}`}
        value={selectedPack?.id || ''}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileFocus={{ scale: 1.02 }}
      >
        <option value="" disabled>Select a word pack</option>
        {Array.isArray(wordPacks) && wordPacks.map(pack => (
          <option key={pack.id} value={pack.id}>{pack.name}</option>
        ))}
      </motion.select>
      
      <AnimatePresence mode="wait">
        {currentWord && (
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="word-container"
          >
            {/* Hint button for kindergarten */}
            {isKindergarten && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowHint(!showHint)}
                className="hint-button mb-4"
                aria-label="Show hint"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                💡
              </motion.button>
            )}
            
            {/* Visual hint display */}
            <AnimatePresence>
              {isKindergarten && showHint && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="hint-display mb-4"
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {hints[currentWord] || '❓'}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.p 
              className={`text-lg mb-2 ${isKindergarten ? 'text-white' : ''}`}
              transition={{ delay: 0.4 }}
            >
              Type the word: {' '}
              <motion.span 
                className={`font-semibold ${isKindergarten ? 'word-highlight' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                {currentWord}
              </motion.span>
            </motion.p>
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className={`border p-2 rounded ${isKindergarten ? 'kindergarten-input' : 'border-gray-400'}`}
                placeholder={isKindergarten ? 'Type here... 🎯' : 'Type here'}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
                whileFocus={{ scale: 1.02, borderColor: isKindergarten ? '#FFD700' : '#3B82F6' }}
                transition={{ duration: 0.2 }}
              />
              <motion.button 
                type="submit" 
                className={`ml-2 p-2 rounded ${isKindergarten ? 'kindergarten-button' : 'bg-green-500 text-white'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {isKindergarten ? '🚀 Go!' : 'Submit'}
              </motion.button>
            </motion.form>
            
            {/* Animated Message Display */}
            <AnimatePresence>
              {message && (
                <motion.p 
                  className={`text-lg font-semibold ${isKindergarten ? 'text-white' : ''}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  style={{
                    color: message.includes('Great job') ? '#10B981' : message.includes('Try again') ? '#EF4444' : 'inherit'
                  }}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;