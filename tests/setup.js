// Jest setup file for browser environment simulation
// This file runs before each test file

// Mock localStorage and sessionStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;

// Mock DOM methods
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn();

// Mock fetch for potential future API calls
global.fetch = jest.fn();

// Clear all mocks before each test
beforeEach(() => {
  // Clear localStorage mock
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Clear sessionStorage mock
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  
  // Clear other mocks
  global.alert.mockClear();
  global.confirm.mockClear();
  global.prompt.mockClear();
  
  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

// Helper function to create a mock DataManager instance
global.createMockDataManager = () => {
  const mockDataManager = {
    initializeData: jest.fn(),
    getBio: jest.fn(() => "Test bio"),
    setBio: jest.fn(),
    getInterests: jest.fn(() => ["Gaming", "Adventure"]),
    setInterests: jest.fn(),
    getPictures: jest.fn(() => []),
    addPicture: jest.fn(),
    deletePicture: jest.fn(),
    getStories: jest.fn(() => []),
    addStory: jest.fn(),
    deleteStory: jest.fn(),
    getGameState: jest.fn(() => ({
      name: 'Test Hero',
      level: 1,
      xp: 0,
      xpNeeded: 100,
      hp: 100,
      maxHp: 100,
      gold: 100,
      currentLocation: 'castle',
      class: 'warrior',
      attack: 15,
      defense: 5,
      mana: 50,
      maxMana: 50,
      activeQuests: [],
      completedQuests: [],
      unlockedLocations: ['castle'],
      questStats: {
        kills: 0,
        resourcesCollected: 0,
        battlesByLocation: { castle: 0 },
        itemsCollected: {},
        bossesDefeated: {},
        artifactsFound: 0
      }
    })),
    saveGameState: jest.fn(),
    resetGame: jest.fn(),
    getPassword: jest.fn(() => 'silas123'),
    setPassword: jest.fn(),
    isAuthenticated: jest.fn(() => false),
    setAuthenticated: jest.fn(),
    getAvailableQuests: jest.fn(() => []),
    canUnlockQuest: jest.fn(() => true),
    acceptQuest: jest.fn(() => true),
    checkQuestProgress: jest.fn(() => ({ progress: {}, isComplete: false })),
    completeQuest: jest.fn(() => true),
    updateQuestProgress: jest.fn(),
    refreshDailyQuests: jest.fn()
  };
  
  return mockDataManager;
};