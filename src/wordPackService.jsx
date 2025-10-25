// wordPackService.js

// Simulated fetch function to get word packs
export const fetchWordPacks = async () => {
  // In a real application, you would fetch this data from an API
  return [
    { id: 1, name: "Pack 1", words: ["MICKEY MOUSE", "MINNIE MOUSE", "DONALD DUCK", "DAISY DUCK", "GOOFY", "PLUTO", "CHIP", "DALE", "SCROOGE MCDUCK", "HUEY", "DEWEY", "LOUIE", "PETE", "CLARABELLE COW", "HORACE HORSECOLLAR"] },
    { id: 2, name: "Pack 2", words: ["APPLE", "BANANA", "CHERRY", "DATE", "ELDERBERRY", "FIG", "GRAPE", "HONEYDEW", "KIWI", "LEMON", "MANGO", "NECTARINE", "ORANGE", "PAPAYA", "QUINCE", "RASPBERRY", "STRAWBERRY", "TANGERINE", "UGLI FRUIT", "WATERMELON"] },
    {"id": 3, "name": "Pre-K 1", "words": ["TEACHER", "APPLE", "RECESS", "STUDENTS", "SIGN LANGUAGE", "CENTERS", "PLAYGROUND", "CRAYONS", "BLOCKS", "STORYTIME", "SNACK", "CIRCLE TIME", "ALPHABET", "NUMBERS", "COLORS", "SHAPES", "FRIENDS", "SHARING", "PAINTING", "MUSIC", "NAP TIME", "PUZZLES", "BOOKS", "DRAWING", "CLEAN UP", "LISTENING", "LEARNING", "GAMES", "OUTSIDE", "TEACHERS DESK"]},
    { 
      id: 4, 
      name: "Kindergarten Fun", 
      words: [
        // Colors - mixed case for learning
        "Red", "Blue", "Yellow", "Green",
        // Animals - mixed case
        "Cat", "Dog", "Bird", "Fish",
        // Family & Home - mixed case
        "Mom", "Dad", "Baby", "Home",
        // School & Play - mixed case
        "Play", "Read", "Friend", "Fun",
        // Food - mixed case
        "Milk", "Cake", "Juice", "Book",
        // Nature - mixed case
        "Sun", "Moon", "Star", "Tree"
      ]
    }
    // Add more packs as needed
  ];
}; 