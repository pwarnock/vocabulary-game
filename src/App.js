import React from 'react';

function App() {
  const words = ["CAT", "DOG", "FISH", "BIRD", "APPLE", "CAR", "HOUSE", "TREE", "SUN", "MOON", "STAR", "BOOK", "TOY", "BALL", "CUP"];
  const [currentWord, setCurrentWord] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [completedWords, setCompletedWords] = React.useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.toUpperCase() === currentWord) {
      setMessage("Great job!");
      setCompletedWords((prev) => [...prev, currentWord]); // Add the completed word to the list
      setInputValue("");

      // Set a new word after a short delay to allow the user to see the message
      setTimeout(() => {
        getNextWord();
        setMessage(""); // Clear the message after showing it
      }, 1000);
    } else {
      setMessage("Try again!");
    }
  };

  const getNextWord = () => {
    // Filter out completed words
    const availableWords = words.filter(word => !completedWords.includes(word));
    
    // If there are no available words left, reset the completed words
    if (availableWords.length === 0) {
      setCompletedWords([]); // Reset completed words
      setMessage("All words completed! Starting over...");
      return getNextWord(); // Call again to get a new word
    }

    // Select a random word from the available words
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(randomWord);
  };

  React.useEffect(() => {
    getNextWord(); // Get the first word when the component mounts
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-2xl font-bold mb-4">Vocabulary Game</h1>
      <p className="text-lg mb-2">Type the word: <span className="font-semibold">{currentWord}</span></p>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-400 p-2 rounded"
          placeholder="Type here"
        />
        <button type="submit" className="ml-2 bg-green-500 text-white p-2 rounded">Submit</button>
      </form>
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  );
}

export default App;