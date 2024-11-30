// wordPackService.js

// Simulated fetch function to get word packs
export const fetchWordPacks = async () => {
  // In a real application, you would fetch this data from an API
  return [
    { id: 1, name: "Pack 1", words: ["MICKEY MOUSE", "MINNIE MOUSE", "DONALD DUCK", "DAISY DUCK", "GOOFY", "PLUTO", "CHIP", "DALE", "SCROOGE MCDUCK", "HUEY", "DEWEY", "LOUIE", "PETE", "CLARABELLE COW", "HORACE HORSECOLLAR"] },
    { id: 2, name: "Pack 2", words: ["APPLE", "BANANA", "CHERRY", "DATE", "ELDERBERRY", "FIG", "GRAPE", "HONEYDEW", "KIWI", "LEMON", "MANGO", "NECTARINE", "ORANGE", "PAPAYA", "QUINCE", "RASPBERRY", "STRAWBERRY", "TANGERINE", "UGLI FRUIT", "WATERMELON"] },
    // Add more packs as needed
  ];
}; 