/**
 * @jest-environment jsdom
 */

// Simple unit tests for core game data structures and logic
// This file tests the game data without executing the entire script

describe('Core Game Data Validation', () => {
  // Load game data by parsing the script content
  let gameScenarios, quests, encounters, equipment, characterClasses, skills;
  
  beforeAll(() => {
    const fs = require('fs');
    const path = require('path');
    const scriptPath = path.join(__dirname, '..', 'script.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // Extract game data objects using regex
    const extractObject = (objName) => {
      const regex = new RegExp(`const ${objName} = ({[\\s\\S]*?^});`, 'm');
      const match = scriptContent.match(regex);
      if (match) {
        try {
          return eval(`(${match[1]})`);
        } catch (e) {
          console.warn(`Could not parse ${objName}:`, e.message);
          return {};
        }
      }
      return {};
    };
    
    gameScenarios = extractObject('gameScenarios');
    quests = extractObject('quests');
    encounters = extractObject('encounters');
    equipment = extractObject('equipment');
    characterClasses = extractObject('characterClasses');
    skills = extractObject('skills');
  });

  describe('Game Scenarios', () => {
    test('should have all required locations', () => {
      const expectedLocations = ['castle', 'forest', 'cave', 'mountain', 'village', 'swamp', 'desert', 'ruins'];
      
      expectedLocations.forEach(location => {
        expect(gameScenarios).toHaveProperty(location);
        expect(gameScenarios[location]).toHaveProperty('image');
        expect(gameScenarios[location]).toHaveProperty('message');
        expect(gameScenarios[location]).toHaveProperty('description');
      });
    });

    test('should have proper level requirements', () => {
      expect(gameScenarios.castle.level).toBe(1);
      expect(gameScenarios.forest.level).toBe(2);
      expect(gameScenarios.mountain.level).toBe(4);
      expect(typeof gameScenarios.desert.level).toBe('number');
      expect(gameScenarios.desert.level).toBeGreaterThan(0);
    });

    test('should have valid location structure', () => {
      Object.values(gameScenarios).forEach(scenario => {
        expect(scenario).toHaveProperty('image');
        expect(scenario).toHaveProperty('message');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('specialEncounters');
        expect(scenario).toHaveProperty('resources');
        expect(Array.isArray(scenario.specialEncounters)).toBe(true);
        expect(Array.isArray(scenario.resources)).toBe(true);
      });
    });
  });

  describe('Quest System Data', () => {
    test('should have proper quest structure', () => {
      Object.values(quests).forEach(quest => {
        expect(quest).toHaveProperty('id');
        expect(quest).toHaveProperty('name');
        expect(quest).toHaveProperty('description');
        expect(quest).toHaveProperty('type');
        expect(quest).toHaveProperty('location');
        expect(quest).toHaveProperty('giver');
        expect(quest).toHaveProperty('requirements');
        expect(quest).toHaveProperty('rewards');
        expect(quest).toHaveProperty('unlockCondition');
        expect(quest).toHaveProperty('completed');
        
        // Validate quest types
        expect(['kill', 'collect', 'location_clear', 'boss', 'survival', 'explore']).toContain(quest.type);
      });
    });

    test('should have valid reward structures', () => {
      Object.values(quests).forEach(quest => {
        const rewards = quest.rewards;
        expect(rewards).toHaveProperty('xp');
        expect(rewards).toHaveProperty('gold');
        expect(typeof rewards.xp).toBe('number');
        expect(typeof rewards.gold).toBe('number');
        expect(rewards.xp).toBeGreaterThan(0);
        expect(rewards.gold).toBeGreaterThan(0);
      });
    });

    test('should have reasonable unlock conditions', () => {
      Object.values(quests).forEach(quest => {
        const condition = quest.unlockCondition;
        if (condition.level) {
          expect(condition.level).toBeGreaterThanOrEqual(1);
          expect(condition.level).toBeLessThanOrEqual(20);
        }
      });
    });
  });

  describe('Character Classes', () => {
    test('should have all character classes defined', () => {
      const expectedClasses = ['warrior', 'archer', 'mage', 'rogue'];
      
      expectedClasses.forEach(className => {
        expect(characterClasses).toHaveProperty(className);
        
        const charClass = characterClasses[className];
        expect(charClass).toHaveProperty('name');
        expect(charClass).toHaveProperty('description');
        expect(charClass).toHaveProperty('bonuses');
        expect(charClass).toHaveProperty('skills');
        // Note: emoji might be included in the name field
        expect(typeof charClass.name).toBe('string');
      });
    });

    test('should have balanced stat bonuses', () => {
      Object.values(characterClasses).forEach(charClass => {
        const bonuses = charClass.bonuses;
        expect(bonuses).toHaveProperty('attack');
        expect(bonuses).toHaveProperty('defense');
        expect(bonuses).toHaveProperty('hp');
        expect(bonuses).toHaveProperty('mana');
        
        // Bonuses should be reasonable
        expect(Math.abs(bonuses.attack)).toBeLessThanOrEqual(15);
        expect(Math.abs(bonuses.defense)).toBeLessThanOrEqual(15);
        expect(Math.abs(bonuses.hp)).toBeLessThanOrEqual(50);
        expect(Math.abs(bonuses.mana)).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('Skills System', () => {
    test('should have skills with proper structure', () => {
      Object.values(skills).forEach(skill => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('description');
        expect(skill).toHaveProperty('manaCost');
        expect(skill).toHaveProperty('cooldown');
        expect(skill).toHaveProperty('effect');
        
        expect(typeof skill.manaCost).toBe('number');
        expect(typeof skill.cooldown).toBe('number');
        expect(skill.manaCost).toBeGreaterThanOrEqual(0);
        expect(skill.cooldown).toBeGreaterThanOrEqual(0);
      });
    });

    test('should have reasonable mana costs', () => {
      const manaCosts = Object.values(skills).map(s => s.manaCost);
      const maxCost = Math.max(...manaCosts);
      const minCost = Math.min(...manaCosts);
      
      expect(maxCost).toBeLessThanOrEqual(100);
      expect(minCost).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Equipment System', () => {
    test('should have weapons and armor arrays', () => {
      expect(equipment).toHaveProperty('weapons');
      expect(equipment).toHaveProperty('armor');
      expect(Array.isArray(equipment.weapons)).toBe(true);
      expect(Array.isArray(equipment.armor)).toBe(true);
      expect(equipment.weapons.length).toBeGreaterThan(0);
      expect(equipment.armor.length).toBeGreaterThan(0);
    });

    test('should have equipment with valid stats', () => {
      equipment.weapons.forEach(weapon => {
        expect(weapon).toHaveProperty('name');
        expect(weapon).toHaveProperty('attack');
        expect(weapon).toHaveProperty('rarity');
        expect(typeof weapon.attack).toBe('number');
        expect(weapon.attack).toBeGreaterThan(0);
        expect(['common', 'uncommon', 'rare', 'epic', 'legendary']).toContain(weapon.rarity);
      });
      
      equipment.armor.forEach(armor => {
        expect(armor).toHaveProperty('name');
        expect(armor).toHaveProperty('defense');
        expect(armor).toHaveProperty('rarity');
        expect(typeof armor.defense).toBe('number');
        expect(armor.defense).toBeGreaterThan(0);
        expect(['common', 'uncommon', 'rare', 'epic', 'legendary']).toContain(armor.rarity);
      });
    });
  });

  describe('Game Balance', () => {
    test('quest rewards should scale with difficulty', () => {
      const questsByLevel = {};
      Object.values(quests).forEach(quest => {
        const level = quest.unlockCondition.level || 1;
        if (!questsByLevel[level]) questsByLevel[level] = [];
        questsByLevel[level].push(quest);
      });
      
      // Higher level quests should generally have higher rewards
      const levels = Object.keys(questsByLevel).map(Number).sort((a, b) => a - b);
      if (levels.length > 1) {
        const lowLevelQuests = questsByLevel[levels[0]];
        const highLevelQuests = questsByLevel[levels[levels.length - 1]];
        
        const avgLowReward = lowLevelQuests.reduce((sum, q) => sum + q.rewards.xp, 0) / lowLevelQuests.length;
        const avgHighReward = highLevelQuests.reduce((sum, q) => sum + q.rewards.xp, 0) / highLevelQuests.length;
        
        expect(avgHighReward).toBeGreaterThanOrEqual(avgLowReward);
      }
    });

    test('equipment should have proper rarity distribution', () => {
      const weaponsByRarity = equipment.weapons.reduce((acc, weapon) => {
        acc[weapon.rarity] = (acc[weapon.rarity] || 0) + 1;
        return acc;
      }, {});
      
      // Should have multiple rarity levels
      const rarities = Object.keys(weaponsByRarity);
      expect(rarities.length).toBeGreaterThan(1);
      
      // Common weapons should exist
      expect(weaponsByRarity.common).toBeGreaterThan(0);
    });

    test('should have progressive difficulty', () => {
      const locationLevels = Object.entries(gameScenarios)
        .filter(([_, data]) => data.level && data.level > 0)
        .map(([name, data]) => ({ name, level: data.level }))
        .sort((a, b) => a.level - b.level);
      
      expect(locationLevels.length).toBeGreaterThan(2);
      
      // Levels should generally increase
      for (let i = 1; i < locationLevels.length; i++) {
        expect(locationLevels[i].level).toBeGreaterThanOrEqual(locationLevels[i-1].level);
      }
    });
  });
});