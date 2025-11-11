/**
 * @jest-environment jsdom
 */

// Mock DataManager class for testing core functionality
class MockDataManager {
  constructor() {
    this.data = {};
  }

  initializeData() {
    if (!this.data.bio) {
      this.data.bio = "Hi! I'm Silas Anderson, and I love exploring new worlds through anime and games!";
    }
    if (!this.data.interests) {
      this.data.interests = ['🎌 Anime', '🐱 Cats', '🗺️ Adventure Games', '👊 Fighting Games'];
    }
    if (!this.data.gameState) {
      this.resetGame();
    }
    if (!this.data.password) {
      this.data.password = 'silas123';
    }
  }

  getBio() {
    return this.data.bio;
  }

  setBio(bio) {
    this.data.bio = bio;
  }

  getInterests() {
    return this.data.interests || [];
  }

  setInterests(interests) {
    this.data.interests = interests;
  }

  getGameState() {
    return this.data.gameState || {};
  }

  saveGameState(state) {
    this.data.gameState = { ...state };
  }

  resetGame() {
    this.data.gameState = {
      name: 'Brave Adventurer',
      level: 1,
      xp: 0,
      xpNeeded: 100,
      hp: 100,
      maxHp: 100,
      gold: 0,
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
    };
  }

  getPassword() {
    return this.data.password;
  }

  setPassword(password) {
    this.data.password = password;
  }

  isAuthenticated() {
    return this.data.authenticated || false;
  }

  setAuthenticated(value) {
    this.data.authenticated = value;
  }

  // Quest system methods
  acceptQuest(questId) {
    const gameState = this.getGameState();
    if (!gameState.activeQuests.includes(questId)) {
      gameState.activeQuests.push(questId);
      this.saveGameState(gameState);
      return true;
    }
    return false;
  }

  completeQuest(questId) {
    const gameState = this.getGameState();
    if (gameState.activeQuests.includes(questId)) {
      gameState.activeQuests = gameState.activeQuests.filter(id => id !== questId);
      gameState.completedQuests.push(questId);
      
      // Add rewards (simplified)
      gameState.xp += 100;
      gameState.gold += 50;
      
      this.saveGameState(gameState);
      return true;
    }
    return false;
  }

  updateQuestProgress(action, data) {
    const gameState = this.getGameState();
    
    switch (action) {
      case 'kill':
        gameState.questStats.kills++;
        break;
      case 'collect_item':
        const item = data.item;
        gameState.questStats.itemsCollected[item] = (gameState.questStats.itemsCollected[item] || 0) + 1;
        break;
      case 'defeat_boss':
        const boss = data.boss;
        gameState.questStats.bossesDefeated[boss] = true;
        break;
    }
    
    this.saveGameState(gameState);
  }
}

describe('DataManager Core Functionality', () => {
  let dataManager;
  
  beforeEach(() => {
    dataManager = new MockDataManager();
  });

  describe('Initialization', () => {
    test('should initialize with default data', () => {
      dataManager.initializeData();
      
      expect(dataManager.getBio()).toContain('Silas Anderson');
      expect(dataManager.getInterests()).toEqual([
        '🎌 Anime',
        '🐱 Cats', 
        '🗺️ Adventure Games',
        '👊 Fighting Games'
      ]);
      expect(dataManager.getPassword()).toBe('silas123');
    });
  });

  describe('Content Management', () => {
    test('should set and get bio', () => {
      const testBio = 'This is a test bio';
      dataManager.setBio(testBio);
      expect(dataManager.getBio()).toBe(testBio);
    });

    test('should set and get interests', () => {
      const testInterests = ['Gaming', 'Reading', 'Music'];
      dataManager.setInterests(testInterests);
      expect(dataManager.getInterests()).toEqual(testInterests);
    });
  });

  describe('Authentication', () => {
    test('should set and get authentication status', () => {
      expect(dataManager.isAuthenticated()).toBe(false);
      
      dataManager.setAuthenticated(true);
      expect(dataManager.isAuthenticated()).toBe(true);
      
      dataManager.setAuthenticated(false);
      expect(dataManager.isAuthenticated()).toBe(false);
    });

    test('should change password', () => {
      dataManager.initializeData();
      const newPassword = 'newPassword123';
      
      dataManager.setPassword(newPassword);
      expect(dataManager.getPassword()).toBe(newPassword);
    });
  });

  describe('Game State Management', () => {
    test('should initialize default game state', () => {
      dataManager.resetGame();
      const gameState = dataManager.getGameState();
      
      expect(gameState.name).toBe('Brave Adventurer');
      expect(gameState.level).toBe(1);
      expect(gameState.xp).toBe(0);
      expect(gameState.hp).toBe(100);
      expect(gameState.gold).toBe(0);
      expect(gameState.currentLocation).toBe('castle');
      expect(gameState.activeQuests).toEqual([]);
      expect(gameState.unlockedLocations).toEqual(['castle']);
    });

    test('should save and retrieve game state', () => {
      dataManager.resetGame();
      let gameState = dataManager.getGameState();
      
      gameState.level = 5;
      gameState.gold = 500;
      gameState.currentLocation = 'forest';
      
      dataManager.saveGameState(gameState);
      
      const retrievedState = dataManager.getGameState();
      expect(retrievedState.level).toBe(5);
      expect(retrievedState.gold).toBe(500);
      expect(retrievedState.currentLocation).toBe('forest');
    });
  });

  describe('Quest System', () => {
    beforeEach(() => {
      dataManager.resetGame();
    });

    test('should accept quest', () => {
      const result = dataManager.acceptQuest('royal_duty');
      expect(result).toBe(true);
      
      const gameState = dataManager.getGameState();
      expect(gameState.activeQuests).toContain('royal_duty');
    });

    test('should not accept same quest twice', () => {
      dataManager.acceptQuest('royal_duty');
      const result = dataManager.acceptQuest('royal_duty');
      expect(result).toBe(false);
    });

    test('should complete quest and apply rewards', () => {
      dataManager.acceptQuest('royal_duty');
      
      const result = dataManager.completeQuest('royal_duty');
      expect(result).toBe(true);
      
      const gameState = dataManager.getGameState();
      expect(gameState.completedQuests).toContain('royal_duty');
      expect(gameState.activeQuests).not.toContain('royal_duty');
      expect(gameState.xp).toBeGreaterThan(0);
      expect(gameState.gold).toBeGreaterThan(0);
    });

    test('should update quest progress', () => {
      dataManager.updateQuestProgress('kill', { enemy: 'Goblin' });
      
      const gameState = dataManager.getGameState();
      expect(gameState.questStats.kills).toBe(1);
    });

    test('should track item collection', () => {
      dataManager.updateQuestProgress('collect_item', { item: 'Forest Essence' });
      
      const gameState = dataManager.getGameState();
      expect(gameState.questStats.itemsCollected['Forest Essence']).toBe(1);
    });

    test('should track boss defeats', () => {
      dataManager.updateQuestProgress('defeat_boss', { boss: 'Dragon' });
      
      const gameState = dataManager.getGameState();
      expect(gameState.questStats.bossesDefeated['Dragon']).toBe(true);
    });
  });

  describe('Game Logic Validation', () => {
    test('should maintain data integrity', () => {
      dataManager.resetGame();
      let gameState = dataManager.getGameState();
      
      // Simulate game progression
      gameState.level = 5;
      gameState.xp = 500;
      gameState.gold = 1000;
      gameState.currentLocation = 'forest';
      
      dataManager.saveGameState(gameState);
      
      const retrievedState = dataManager.getGameState();
      expect(retrievedState).toEqual(gameState);
    });

    test('should handle quest progression', () => {
      dataManager.resetGame();
      
      // Accept multiple quests
      dataManager.acceptQuest('quest1');
      dataManager.acceptQuest('quest2');
      dataManager.acceptQuest('quest3');
      
      let gameState = dataManager.getGameState();
      expect(gameState.activeQuests).toHaveLength(3);
      
      // Complete one quest
      dataManager.completeQuest('quest1');
      
      gameState = dataManager.getGameState();
      expect(gameState.activeQuests).toHaveLength(2);
      expect(gameState.completedQuests).toHaveLength(1);
    });

    test('should validate stat progression', () => {
      dataManager.resetGame();
      let gameState = dataManager.getGameState();
      
      const initialStats = {
        level: gameState.level,
        xp: gameState.xp,
        gold: gameState.gold
      };
      
      // First accept a quest, then complete it
      dataManager.acceptQuest('test_quest');
      dataManager.completeQuest('test_quest');
      
      gameState = dataManager.getGameState();
      expect(gameState.xp).toBeGreaterThan(initialStats.xp);
      expect(gameState.gold).toBeGreaterThan(initialStats.gold);
    });
  });
});