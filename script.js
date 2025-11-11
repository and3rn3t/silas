// Data Storage using LocalStorage
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('silas-bio')) {
            localStorage.setItem(
                'silas-bio',
                'Hi! I\'m Silas Anderson, and I love exploring new worlds through anime and games!'
            );
        }
        if (!localStorage.getItem('silas-interests')) {
            localStorage.setItem(
                'silas-interests',
                JSON.stringify(['🎌 Anime', '🐱 Cats', '🗺️ Adventure Games', '👊 Fighting Games'])
            );
        }
        if (!localStorage.getItem('silas-pictures')) {
            localStorage.setItem('silas-pictures', JSON.stringify([]));
        }
        if (!localStorage.getItem('silas-stories')) {
            localStorage.setItem('silas-stories', JSON.stringify([]));
        }
        if (!localStorage.getItem('silas-game-state')) {
            this.resetGame();
        }
        if (!localStorage.getItem('silas-password')) {
            // Default password: silas123
            localStorage.setItem('silas-password', 'silas123');
        }
    }

    getBio() {
        return localStorage.getItem('silas-bio');
    }

    setBio(bio) {
        localStorage.setItem('silas-bio', bio);
    }

    getInterests() {
        return JSON.parse(localStorage.getItem('silas-interests'));
    }

    setInterests(interests) {
        localStorage.setItem('silas-interests', JSON.stringify(interests));
    }

    getPictures() {
        return JSON.parse(localStorage.getItem('silas-pictures'));
    }

    addPicture(picture) {
        const pictures = this.getPictures();
        pictures.push(picture);
        localStorage.setItem('silas-pictures', JSON.stringify(pictures));
    }

    deletePicture(index) {
        const pictures = this.getPictures();
        pictures.splice(index, 1);
        localStorage.setItem('silas-pictures', JSON.stringify(pictures));
    }

    getStories() {
        return JSON.parse(localStorage.getItem('silas-stories'));
    }

    addStory(story) {
        const stories = this.getStories();
        stories.push(story);
        localStorage.setItem('silas-stories', JSON.stringify(stories));
    }

    deleteStory(index) {
        const stories = this.getStories();
        stories.splice(index, 1);
        localStorage.setItem('silas-stories', JSON.stringify(stories));
    }

    getGameState() {
        return JSON.parse(localStorage.getItem('silas-game-state'));
    }

    saveGameState(state) {
        localStorage.setItem('silas-game-state', JSON.stringify(state));
    }

    resetGame() {
        const initialState = {
            name: 'Brave Adventurer',
            level: 1,
            xp: 0,
            xpNeeded: 100,
            hp: 100,
            maxHp: 100,
            gold: 0,
            currentLocation: 'castle',
            class: 'warrior', // Set during character creation
            attack: 15,
            defense: 5,
            critChance: 10,
            dodgeChance: 5,
            mana: 50,
            maxMana: 50,
            equipment: {
                weapon: { name: 'Iron Sword', attack: 10, rarity: 'common' },
                armor: { name: 'Leather Armor', defense: 5, rarity: 'common' }
            },
            skills: {
                available: [], // Unlocked skills
                cooldowns: {}, // Skill cooldowns
                ultimateReady: true
            },
            inventory: [],
            achievements: [],
            bossesDefeated: 0,
            explorationCount: 0,
            inBattle: false,
            currentEnemy: null,
            battleTurn: 'player',
            // Quest System Data
            activeQuests: [],
            completedQuests: [],
            availableQuests: ['royal_duty'], // Starting quests available
            unlockedLocations: ['castle'],
            dailyQuestProgress: {},
            lastDailyRefresh: new Date().toDateString(),
            questStats: {
                kills: 0,
                resourcesCollected: 0,
                locationsExplored: 0,
                battlesByLocation: { castle: 0 },
                itemsCollected: {},
                bossesDefeated: {},
                artifactsFound: 0,
                daily_kills: 0,
                daily_resources: 0,
                daily_skills: 0
            },
            // Weather System
            currentWeather: 'clear',
            weatherChangeTimer: 0,
            weatherDuration: 5, // Weather changes every 5 explorations

            // Pet System
            pets: [], // Array of owned pets
            activePet: null, // Currently active pet (only one at a time)
            petEncounters: 0 // Track encounters for pet finding
        };
        this.saveGameState(initialState);
    }

    getPassword() {
        return localStorage.getItem('silas-password');
    }

    setPassword(password) {
        localStorage.setItem('silas-password', password);
    }

    isAuthenticated() {
        return sessionStorage.getItem('silas-authenticated') === 'true';
    }

    setAuthenticated(value) {
        sessionStorage.setItem('silas-authenticated', value ? 'true' : 'false');
    }

    // Quest Management Methods
    getAvailableQuests() {
        const gameState = this.getGameState();
        const availableQuests = [];

        for (const questId in quests) {
            const quest = quests[questId];
            const isActive = gameState.activeQuests.includes(questId);
            const isCompleted = gameState.completedQuests.includes(questId);

            if (!isActive && !isCompleted && this.canUnlockQuest(quest, gameState)) {
                availableQuests.push(quest);
            }
        }

        return availableQuests;
    }

    canUnlockQuest(quest, gameState) {
        const condition = quest.unlockCondition;

        // Check level requirement
        if (condition.level && gameState.level < condition.level) {
            return false;
        }

        // Check bosses defeated requirement
        if (condition.bossesDefeated && gameState.bossesDefeated < condition.bossesDefeated) {
            return false;
        }

        // Check quest completion requirement
        if (condition.questCompleted && !gameState.completedQuests.includes(condition.questCompleted)) {
            return false;
        }

        return true;
    }

    acceptQuest(questId) {
        const gameState = this.getGameState();
        if (!gameState.activeQuests.includes(questId)) {
            gameState.activeQuests.push(questId);
            this.saveGameState(gameState);
            return true;
        }
        return false;
    }

    checkQuestProgress(questId, gameState) {
        const quest = quests[questId];
        if (!quest) return false;

        const progress = {};
        let isComplete = true;

        // Check different quest requirements
        switch (quest.type) {
        case 'kill': {
            progress.kills = gameState.questStats.kills;
            isComplete = progress.kills >= quest.requirements.kills;
            break;
        }

        case 'collect': {
            for (const item in quest.requirements.items) {
                const needed = quest.requirements.items[item];
                const have = gameState.questStats.itemsCollected[item] || 0;
                progress[item] = have;
                if (have < needed) isComplete = false;
            }
            break;
        }

        case 'location_clear': {
            for (const location in quest.requirements.battles_in_location) {
                const needed = quest.requirements.battles_in_location[location];
                const have = gameState.questStats.battlesByLocation[location] || 0;
                progress[location] = have;
                if (have < needed) isComplete = false;
            }
            break;
        }

        case 'boss': {
            const bossName = quest.requirements.boss_defeat;
            progress.boss = gameState.questStats.bossesDefeated[bossName] || false;
            isComplete = progress.boss;
            break;
        }

        case 'survival': {
            const locationBattles = gameState.questStats.battlesByLocation[quest.location] || 0;
            progress.battles = locationBattles;
            isComplete = locationBattles >= quest.requirements[quest.location + '_battles'];
            break;
        }

        case 'explore': {
            progress.explored = gameState.questStats.artifactsFound;
            progress.artifacts = gameState.questStats.artifactsFound;
            isComplete =
                    progress.explored >= quest.requirements.ruins_explored &&
                    progress.artifacts >= quest.requirements.artifacts_found;
            break;
        }
        }
        return { progress, isComplete };
    }

    completeQuest(questId) {
        const gameState = this.getGameState();
        const quest = quests[questId];

        if (!quest || !gameState.activeQuests.includes(questId)) {
            return false;
        }

        // Remove from active quests
        gameState.activeQuests = gameState.activeQuests.filter(id => id !== questId);

        // Add to completed quests
        gameState.completedQuests.push(questId);

        // Apply rewards
        if (quest.rewards.xp) {
            gameState.xp += quest.rewards.xp;
        }
        if (quest.rewards.gold) {
            gameState.gold += quest.rewards.gold;
        }
        if (quest.rewards.item) {
            gameState.inventory.push({
                name: quest.rewards.item,
                type: 'quest_reward',
                description: `Reward from ${quest.name}`
            });
        }
        if (quest.rewards.unlocks) {
            if (!gameState.unlockedLocations.includes(quest.rewards.unlocks)) {
                gameState.unlockedLocations.push(quest.rewards.unlocks);
            }
        }

        this.saveGameState(gameState);
        return true;
    }

    updateQuestProgress(action, data) {
        const gameState = this.getGameState();

        switch (action) {
        case 'kill': {
            gameState.questStats.kills++;
            gameState.questStats.daily_kills++;
            break;
        }

        case 'collect_item': {
            const item = data.item;
            gameState.questStats.itemsCollected[item] = (gameState.questStats.itemsCollected[item] || 0) + 1;
            gameState.questStats.resourcesCollected++;
            gameState.questStats.daily_resources++;
            break;
        }

        case 'battle_location': {
            const location = data.location;
            const currentCount = gameState.questStats.battlesByLocation[location] || 0;
            gameState.questStats.battlesByLocation[location] = currentCount + 1;
            break;
        }

        case 'defeat_boss': {
            const boss = data.boss;
            gameState.questStats.bossesDefeated[boss] = true;
            break;
        }

        case 'use_skill': {
            gameState.questStats.daily_skills++;
            break;
        }

        case 'find_artifact': {
            gameState.questStats.artifactsFound++;
            break;
        }
        }

        // Check if any active quests are completed
        const completedQuests = [];
        for (const questId of gameState.activeQuests) {
            const { isComplete } = this.checkQuestProgress(questId, gameState);
            if (isComplete) {
                completedQuests.push(questId);
            }
        }

        // Complete the quests
        for (const questId of completedQuests) {
            this.completeQuest(questId);
            showMessage(`Quest completed: ${quests[questId].name}!`, 'success');
        }

        this.saveGameState(gameState);
    }

    refreshDailyQuests() {
        const gameState = this.getGameState();
        const today = new Date().toDateString();

        if (gameState.lastDailyRefresh !== today) {
            // Reset daily progress
            gameState.questStats.daily_kills = 0;
            gameState.questStats.daily_resources = 0;
            gameState.questStats.daily_skills = 0;
            gameState.lastDailyRefresh = today;

            this.saveGameState(gameState);
        }
    }
}

// Initialize Data Manager
const dataManager = new DataManager();

// Authentication
function checkAuth() {
    const adminNavLink = document.getElementById('admin-nav-link');
    if (dataManager.isAuthenticated()) {
        adminNavLink.style.display = 'block';
    } else {
        adminNavLink.style.display = 'none';
    }
}

function login() {
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');

    if (password === dataManager.getPassword()) {
        dataManager.setAuthenticated(true);
        errorElement.textContent = '';
        document.getElementById('login-password').value = '';
        checkAuth();

        // Navigate to admin section
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-section="admin"]').classList.add('active');

        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('admin').classList.add('active');

        loadAdmin();
        showMessage('Successfully logged in!', 'success');
    } else {
        errorElement.textContent = 'Incorrect password. Please try again.';
        document.getElementById('login-password').value = '';
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        dataManager.setAuthenticated(false);
        checkAuth();

        // Navigate to home section
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-section="home"]').classList.add('active');

        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('home').classList.add('active');

        showMessage('Successfully logged out!', 'success');
    }
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('Please fill in all password fields!', 'error');
        return;
    }

    if (currentPassword !== dataManager.getPassword()) {
        showMessage('Current password is incorrect!', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters!', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match!', 'error');
        return;
    }

    dataManager.setPassword(newPassword);
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    showMessage('Password changed successfully!', 'success');
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const sectionId = link.dataset.section;

            // Check if trying to access admin without authentication
            if (sectionId === 'admin' && !dataManager.isAuthenticated()) {
                // Show login section instead
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById('login').classList.add('active');
                return;
            }

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show selected section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Home Section
function loadHome() {
    const bioDisplay = document.getElementById('bio-display');
    const interestsDisplay = document.getElementById('interests-display');

    bioDisplay.innerHTML = `<p>${escapeHtml(dataManager.getBio())}</p>`;

    const interests = dataManager.getInterests();
    interestsDisplay.innerHTML = interests
        .map(interest => `<div class="interest-tag">${escapeHtml(interest)}</div>`)
        .join('');
}

// Gallery Section
function loadGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const emptyMessage = document.getElementById('gallery-empty');
    const pictures = dataManager.getPictures();

    if (pictures.length === 0) {
        galleryGrid.style.display = 'none';
        emptyMessage.style.display = 'block';
    } else {
        galleryGrid.style.display = 'grid';
        emptyMessage.style.display = 'none';
        galleryGrid.innerHTML = pictures
            .map(
                (pic, index) => `
            <div class="gallery-item">
                <img src="${escapeHtml(pic.url)}" alt="${escapeHtml(pic.caption)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect width=%22250%22 height=%22250%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22%3EImage Not Found%3C/text%3E%3C/svg%3E'">
                <div class="gallery-caption">${escapeHtml(pic.caption)}</div>
                <button class="delete-btn" onclick="deletePicture(${index})">×</button>
            </div>
        `
            )
            .join('');
    }
}

// eslint-disable-next-line no-unused-vars
function deletePicture(index) {
    if (confirm('Are you sure you want to delete this picture?')) {
        dataManager.deletePicture(index);
        loadGallery();
        showMessage('Picture deleted successfully!', 'success');
    }
}

// Stories Section
function loadStories() {
    const storiesList = document.getElementById('stories-list');
    const emptyMessage = document.getElementById('stories-empty');
    const stories = dataManager.getStories();

    if (stories.length === 0) {
        storiesList.style.display = 'none';
        emptyMessage.style.display = 'block';
    } else {
        storiesList.style.display = 'flex';
        emptyMessage.style.display = 'none';
        storiesList.innerHTML = stories
            .map(
                (story, index) => `
            <div class="story-item">
                <h3>${escapeHtml(story.title)}</h3>
                <p>${escapeHtml(story.content)}</p>
                <button class="delete-btn" onclick="deleteStory(${index})">Delete</button>
            </div>
        `
            )
            .join('');
    }
}

// eslint-disable-next-line no-unused-vars
function deleteStory(index) {
    if (confirm('Are you sure you want to delete this story?')) {
        dataManager.deleteStory(index);
        loadStories();
        showMessage('Story deleted successfully!', 'success');
    }
}

// Game Section
const gameScenarios = {
    castle: {
        name: '🏰 Royal Castle',
        message: 'You stand at the majestic castle gates. Knights patrol the walls.',
        image: '🏰',
        level: 1,
        specialEncounters: ['Royal Guard', 'Court Mage', 'Castle Knight'],
        resources: ['Honor Tokens', 'Royal Seal', 'Knight\'s Blessing', 'Iron Ore'],
        questGiver: true,
        description: 'The seat of power in the realm. Knights and nobles gather here.',
        unlockCondition: null // Always available
    },
    forest: {
        name: '🌲 Enchanted Forest',
        message: 'Ancient trees tower above you. Magic flows through every leaf.',
        image: '🌲',
        level: 2,
        specialEncounters: ['Forest Guardian', 'Wild Elf', 'Dire Wolf'],
        resources: ['Mystical Herbs', 'Elven Wood', 'Forest Essence'],
        questGiver: true,
        description: 'A magical woodland where nature spirits dwell.',
        unlockCondition: { level: 3 }
    },
    cave: {
        name: '🕳️ Crystal Caverns',
        message: 'Glowing crystals illuminate the underground passages.',
        image: '🕳️',
        level: 3,
        specialEncounters: ['Crystal Golem', 'Cave Troll', 'Gem Spirit'],
        resources: ['Rare Crystals', 'Cave Minerals', 'Glowing Gems'],
        questGiver: false,
        description: 'Deep caves filled with precious gems and dangerous creatures.',
        unlockCondition: { level: 5 }
    },
    mountain: {
        name: '⛰️ Dragon\'s Peak',
        message: 'The air grows thin as you ascend the legendary mountain.',
        image: '⛰️',
        level: 4,
        specialEncounters: ['Mountain Dragon', 'Storm Giant', 'Ice Elemental'],
        resources: ['Dragon Scales', 'Mountain Stone', 'Storm Essence'],
        questGiver: true,
        description: 'The highest peak in the realm, home to ancient dragons.',
        unlockCondition: { level: 8 }
    },
    village: {
        name: '🏘️ Merchant Village',
        message: 'Bustling traders and craftsmen fill the marketplace.',
        image: '🏘️',
        level: 1,
        specialEncounters: ['Village Chief', 'Master Blacksmith', 'Traveling Merchant'],
        resources: ['Trade Goods', 'Crafting Materials', 'Local Currency', 'Pure Water', 'Rope'],
        questGiver: true,
        description: 'A thriving trade hub where adventurers resupply.',
        unlockCondition: null // Always available
    },
    swamp: {
        name: '🐸 Mystic Swamp',
        message: 'Murky waters and twisted trees create an eerie atmosphere.',
        image: '🐸',
        level: 3,
        specialEncounters: ['Swamp Witch', 'Bog Monster', 'Will O\' Wisp'],
        resources: ['Witch\'s Brew', 'Swamp Gas', 'Cursed Moss'],
        questGiver: true,
        description: 'A treacherous wetland where dark magic thrives.',
        unlockCondition: { level: 6, questCompleted: 'forest_guardian' }
    },
    desert: {
        name: '🏜️ Scorching Desert',
        message: 'Endless sand dunes stretch beneath the blazing sun.',
        image: '🏜️',
        level: 4,
        specialEncounters: ['Sand Elemental', 'Desert Nomad', 'Mirage Spirit'],
        resources: ['Desert Glass', 'Sun Crystals', 'Nomad Relics'],
        questGiver: true,
        description: 'A harsh wasteland hiding ancient secrets.',
        unlockCondition: { level: 10, bossesDefeated: 2 }
    },
    ruins: {
        name: '🏛️ Ancient Ruins',
        message: 'Crumbling stone structures tell tales of a lost civilization.',
        image: '🏛️',
        level: 5,
        specialEncounters: ['Ancient Guardian', 'Lost Spirit', 'Ruin Keeper'],
        resources: ['Ancient Artifacts', 'Runic Stones', 'Lost Knowledge', 'Compass'],
        questGiver: true,
        description: 'Mysterious ruins of an ancient magical empire.',
        unlockCondition: { level: 12, questCompleted: 'dragon_peak_trial' }
    }
};

// Weather System
const weatherTypes = {
    clear: {
        name: 'Clear Skies',
        emoji: '☀️',
        description: 'Perfect weather for adventure!',
        effects: {
            treasureBonus: 1.3,        // 30% more treasure
            resourceBonus: 1.0,        // Normal resources
            enemyDangerMod: 1.0,       // Normal enemy strength
            xpBonus: 1.1,              // 10% XP bonus
            encounterRateChange: 0     // Normal encounter rates
        },
        rarity: 0.25  // 25% chance
    },
    cloudy: {
        name: 'Cloudy',
        emoji: '☁️',
        description: 'Overcast skies create a neutral atmosphere.',
        effects: {
            treasureBonus: 1.0,        // Normal treasure
            resourceBonus: 1.0,        // Normal resources
            enemyDangerMod: 1.0,       // Normal enemy strength
            xpBonus: 1.0,              // Normal XP
            encounterRateChange: 0     // Normal encounter rates
        },
        rarity: 0.3   // 30% chance
    },
    rain: {
        name: 'Light Rain',
        emoji: '🌧️',
        description: 'Gentle rain nourishes the land.',
        effects: {
            treasureBonus: 0.8,        // 20% less treasure (hidden by rain)
            resourceBonus: 1.5,        // 50% more resources (plants flourish)
            enemyDangerMod: 0.9,       // Enemies 10% weaker (soggy)
            xpBonus: 1,              // Normal XP
            encounterRateChange: -0.1  // 10% fewer encounters
        },
        rarity: 0.2   // 20% chance
    },
    storm: {
        name: 'Thunderstorm',
        emoji: '⛈️',
        description: 'Lightning crackles across dark clouds!',
        effects: {
            treasureBonus: 0.7,        // 30% less treasure
            resourceBonus: 0.8,        // 20% fewer resources
            enemyDangerMod: 1.4,       // Enemies 40% stronger (enraged)
            xpBonus: 1.3,              // 30% more XP (dangerous = rewarding)
            encounterRateChange: 0.15  // 15% more encounters
        },
        rarity: 0.1   // 10% chance
    },
    fog: {
        name: 'Thick Fog',
        emoji: '🌫️',
        description: 'Dense fog obscures your vision.',
        effects: {
            treasureBonus: 1.2,        // 20% more treasure (hidden caches visible)
            resourceBonus: 0.7,        // 30% fewer resources (hard to see)
            enemyDangerMod: 1.1,       // Enemies 10% stronger (ambush advantage)
            xpBonus: 1,              // Normal XP
            encounterRateChange: 0.1   // 10% more encounters (surprise attacks)
        },
        rarity: 0.1   // 10% chance
    },
    snow: {
        name: 'Light Snow',
        emoji: '❄️',
        description: 'Gentle snowflakes drift from the sky.',
        effects: {
            treasureBonus: 0.9,        // 10% less treasure
            resourceBonus: 1.1,        // 10% more resources (preserved by cold)
            enemyDangerMod: 0.8,       // Enemies 20% weaker (sluggish from cold)
            xpBonus: 1.1,              // 10% more XP
            encounterRateChange: -0.05 // 5% fewer encounters
        },
        rarity: 0.05  // 5% chance
    }
};

// Pet/Companion System
const petTypes = {
    wolf_pup: {
        name: 'Wolf Pup',
        emoji: '🐺',
        rarity: 'common',
        description: 'A loyal young wolf that aids in combat',
        baseStats: {
            attack: 3,
            defense: 2,
            health: 15,
            loyalty: 50
        },
        abilities: ['pack_hunt', 'howl'],
        unlockLevel: 1,
        findChance: 0.08, // 8% chance when exploring forest
        locations: ['forest', 'mountain'],
        growthRate: 1.2,
        maxLevel: 10
    },
    crystal_sprite: {
        name: 'Crystal Sprite',
        emoji: '🧚‍♀️',
        rarity: 'uncommon',
        description: 'A magical fairy that enhances mana and provides healing',
        baseStats: {
            attack: 1,
            defense: 1,
            health: 8,
            loyalty: 60
        },
        abilities: ['mana_boost', 'healing_light'],
        unlockLevel: 3,
        findChance: 0.05, // 5% chance in caves
        locations: ['cave', 'ruins'],
        growthRate: 1.3,
        maxLevel: 12
    },
    shadow_cat: {
        name: 'Shadow Cat',
        emoji: '🐈‍⬛',
        rarity: 'rare',
        description: 'A mysterious feline that increases stealth and critical hits',
        baseStats: {
            attack: 4,
            defense: 3,
            health: 12,
            loyalty: 40
        },
        abilities: ['stealth_strike', 'lucky_charm'],
        unlockLevel: 5,
        findChance: 0.03, // 3% chance in swamps
        locations: ['swamp', 'ruins'],
        growthRate: 1.4,
        maxLevel: 15
    },
    fire_salamander: {
        name: 'Fire Salamander',
        emoji: '🦎',
        rarity: 'rare',
        description: 'A flame-breathing lizard that boosts fire damage',
        baseStats: {
            attack: 6,
            defense: 4,
            health: 20,
            loyalty: 35
        },
        abilities: ['fire_breath', 'burn_aura'],
        unlockLevel: 7,
        findChance: 0.04, // 4% chance in desert/mountain
        locations: ['desert', 'mountain'],
        growthRate: 1.5,
        maxLevel: 18
    },
    ancient_turtle: {
        name: 'Ancient Turtle',
        emoji: '🐢',
        rarity: 'legendary',
        description: 'A wise ancient creature that provides massive defense bonuses',
        baseStats: {
            attack: 2,
            defense: 8,
            health: 40,
            loyalty: 80
        },
        abilities: ['shell_guard', 'wisdom_aura', 'regeneration'],
        unlockLevel: 10,
        findChance: 0.01, // 1% chance in ruins
        locations: ['ruins'],
        growthRate: 1.8,
        maxLevel: 25
    }
};

const petAbilities = {
    pack_hunt: {
        name: 'Pack Hunt',
        description: 'Increases damage by 15% when both player and pet attack',
        type: 'combat',
        effect: 'damage_boost',
        value: 0.15
    },
    howl: {
        name: 'Intimidating Howl',
        description: 'Reduces enemy attack by 10% for 3 turns',
        type: 'debuff',
        effect: 'enemy_attack_reduce',
        value: 0.1,
        duration: 3
    },
    mana_boost: {
        name: 'Mana Boost',
        description: 'Increases max mana by 20%',
        type: 'passive',
        effect: 'max_mana_increase',
        value: 0.2
    },
    healing_light: {
        name: 'Healing Light',
        description: 'Restores 5 HP after each battle',
        type: 'passive',
        effect: 'post_battle_heal',
        value: 5
    },
    stealth_strike: {
        name: 'Stealth Strike',
        description: 'Increases critical hit chance by 15%',
        type: 'passive',
        effect: 'crit_chance_increase',
        value: 15
    },
    lucky_charm: {
        name: 'Lucky Charm',
        description: 'Increases treasure find rate by 20%',
        type: 'passive',
        effect: 'treasure_bonus',
        value: 0.2
    },
    fire_breath: {
        name: 'Fire Breath',
        description: 'Deals fire damage to enemies (25% chance per turn)',
        type: 'combat',
        effect: 'fire_damage',
        value: 8,
        chance: 0.25
    },
    burn_aura: {
        name: 'Burn Aura',
        description: 'Enemies take 2 damage per turn from burns',
        type: 'aura',
        effect: 'burn_damage',
        value: 2
    },
    shell_guard: {
        name: 'Shell Guard',
        description: 'Blocks 30% of incoming damage',
        type: 'passive',
        effect: 'damage_reduction',
        value: 0.3
    },
    wisdom_aura: {
        name: 'Wisdom Aura',
        description: 'Increases XP gain by 25%',
        type: 'passive',
        effect: 'xp_bonus',
        value: 0.25
    },
    regeneration: {
        name: 'Regeneration',
        description: 'Restores 10 HP per exploration',
        type: 'passive',
        effect: 'exploration_heal',
        value: 10
    }
};

// Crafting System
const craftingRecipes = {
    // Weapons
    iron_blade: {
        name: 'Iron Blade',
        type: 'weapon',
        rarity: 'common',
        attack: 18,
        materials: {
            'Cave Minerals': 3,
            'Iron Ore': 2
        },
        requiredLevel: 3,
        description: 'A sturdy iron sword with improved sharpness',
        category: 'weapons'
    },
    mystic_staff: {
        name: 'Mystic Staff',
        type: 'weapon',
        rarity: 'uncommon',
        attack: 15,
        manaBonus: 20,
        materials: {
            'Mystical Herbs': 4,
            'Elven Wood': 3,
            'Forest Essence': 2
        },
        requiredLevel: 5,
        description: 'A magical staff that enhances spell power',
        category: 'weapons'
    },
    dragon_fang_sword: {
        name: 'Dragon Fang Sword',
        type: 'weapon',
        rarity: 'rare',
        attack: 35,
        critBonus: 15,
        materials: {
            'Dragon Scales': 5,
            'Ancient Artifacts': 2,
            'Storm Essence': 3
        },
        requiredLevel: 10,
        description: 'A legendary blade forged from dragon materials',
        category: 'weapons'
    },

    // Armor
    crystal_mail: {
        name: 'Crystal Mail',
        type: 'armor',
        rarity: 'uncommon',
        defense: 12,
        hpBonus: 30,
        materials: {
            'Rare Crystals': 4,
            'Cave Minerals': 6,
            'Glowing Gems': 2
        },
        requiredLevel: 4,
        description: 'Armor infused with protective crystal magic',
        category: 'armor'
    },
    shadow_cloak: {
        name: 'Shadow Cloak',
        type: 'armor',
        rarity: 'rare',
        defense: 8,
        dodgeBonus: 20,
        stealthBonus: true,
        materials: {
            'Cursed Moss': 6,
            'Witch\'s Brew': 3,
            'Swamp Gas': 4
        },
        requiredLevel: 7,
        description: 'A mysterious cloak that bends light and shadow',
        category: 'armor'
    },

    // Consumables
    super_health_potion: {
        name: 'Super Health Potion',
        type: 'consumable',
        rarity: 'common',
        effect: 'heal',
        value: 100,
        materials: {
            'Mystical Herbs': 2,
            'Pure Water': 1
        },
        requiredLevel: 2,
        description: 'A potent healing potion that restores 100 HP',
        category: 'consumables'
    },
    mana_elixir: {
        name: 'Mana Elixir',
        type: 'consumable',
        rarity: 'uncommon',
        effect: 'mana',
        value: 50,
        materials: {
            'Forest Essence': 3,
            'Glowing Gems': 2,
            'Pure Water': 1
        },
        requiredLevel: 4,
        description: 'Restores mana and temporarily increases max mana by 20',
        category: 'consumables'
    },
    strength_brew: {
        name: 'Strength Brew',
        type: 'consumable',
        rarity: 'rare',
        effect: 'buff',
        value: { attack: 10, duration: 5 },
        materials: {
            'Dragon Scales': 2,
            'Mountain Stone': 4,
            'Ancient Artifacts': 1
        },
        requiredLevel: 8,
        description: 'Temporarily increases attack by 10 for 5 battles',
        category: 'consumables'
    },

    // Special Items
    pet_treat: {
        name: 'Magical Pet Treat',
        type: 'pet_item',
        rarity: 'uncommon',
        effect: 'loyalty',
        value: 25,
        materials: {
            'Mystical Herbs': 2,
            'Trade Goods': 3,
            'Local Currency': 5
        },
        requiredLevel: 3,
        description: 'Increases pet loyalty by 25 points',
        category: 'pet_items'
    },
    exploration_kit: {
        name: 'Advanced Exploration Kit',
        type: 'utility',
        rarity: 'rare',
        effect: 'exploration_bonus',
        value: 0.2, // 20% better exploration outcomes
        materials: {
            'Crafting Materials': 8,
            'Trade Goods': 6,
            'Rope': 4,
            'Compass': 1
        },
        requiredLevel: 6,
        description: 'Improves exploration success rates by 20% for 10 explorations',
        category: 'utility'
    }
};

// Common crafting materials that can be found
const craftingMaterials = {
    'Iron Ore': { description: 'Raw iron for weapon crafting', rarity: 'common' },
    'Pure Water': { description: 'Clean water for potion brewing', rarity: 'common' },
    'Rope': { description: 'Strong rope for equipment', rarity: 'common' },
    'Compass': { description: 'Navigation tool', rarity: 'uncommon' }
};

// Random Events System
const randomEvents = {
    mysterious_merchant: {
        name: 'Mysterious Merchant',
        emoji: '🧙‍♂️',
        description: 'A hooded figure offers to trade rare items',
        chance: 0.03, // 3% chance
        type: 'choice',
        minLevel: 2,
        locations: ['village', 'forest', 'cave'],
        choices: [
            {
                text: 'Trade 100 gold for a rare item',
                cost: { gold: 100 },
                reward: { type: 'random_equipment', rarity: 'rare' },
                requirementText: 'Requires 100 gold'
            },
            {
                text: 'Trade resources for magical knowledge',
                cost: { resources: 3 },
                reward: { type: 'skill_unlock' },
                requirementText: 'Requires 3 random resources'
            },
            {
                text: 'Politely decline and walk away',
                cost: {},
                reward: { type: 'nothing' },
                requirementText: 'No cost, no reward'
            }
        ]
    },

    ancient_shrine: {
        name: 'Ancient Shrine',
        emoji: '⛩️',
        description: 'You discover a mystical shrine emanating powerful energy',
        chance: 0.025, // 2.5% chance
        type: 'choice',
        minLevel: 5,
        locations: ['forest', 'mountain', 'ruins'],
        choices: [
            {
                text: 'Offer 50 gold as tribute',
                cost: { gold: 50 },
                reward: { type: 'blessing', effect: 'hp_boost', value: 50 },
                requirementText: 'Permanently increases max HP by 50'
            },
            {
                text: 'Pray for strength (costs mana)',
                cost: { mana: 30 },
                reward: { type: 'blessing', effect: 'attack_boost', value: 5 },
                requirementText: 'Permanently increases attack by 5'
            },
            {
                text: 'Leave the shrine untouched',
                cost: {},
                reward: { type: 'safe' },
                requirementText: 'Safe choice, no risk or reward'
            }
        ]
    },

    cursed_treasure: {
        name: 'Cursed Treasure Chest',
        emoji: '📦',
        description: 'A treasure chest glows with ominous energy...',
        chance: 0.04, // 4% chance
        type: 'risk_reward',
        minLevel: 3,
        locations: ['cave', 'swamp', 'ruins', 'desert'],
        outcomes: [
            {
                chance: 0.6,
                result: 'success',
                reward: { gold: [100, 300], items: ['Cursed Gem', 'Dark Crystal'] },
                message: 'You carefully open the chest and claim its treasures!'
            },
            {
                chance: 0.3,
                result: 'curse',
                penalty: { hp_drain: 20, curse_duration: 3 },
                message: 'The chest was trapped! A curse drains your strength...'
            },
            {
                chance: 0.1,
                result: 'mimic',
                enemy: 'Treasure Mimic',
                message: 'The chest suddenly grows teeth and attacks!'
            }
        ]
    },

    wandering_scholar: {
        name: 'Wandering Scholar',
        emoji: '👨‍🏫',
        description: 'A learned scholar shares ancient wisdom',
        chance: 0.035, // 3.5% chance
        type: 'beneficial',
        minLevel: 4,
        locations: ['village', 'ruins', 'castle'],
        outcomes: [
            {
                chance: 0.4,
                reward: { xp: [50, 150] },
                message: 'The scholar teaches you ancient combat techniques! +XP'
            },
            {
                chance: 0.3,
                reward: { skill_point: 1 },
                message: 'You learn a new skill from the scholar\'s teachings!'
            },
            {
                chance: 0.3,
                reward: { recipe_unlock: 'random' },
                message: 'The scholar shares a secret crafting recipe with you!'
            }
        ]
    },

    magical_portal: {
        name: 'Unstable Magic Portal',
        emoji: '🌀',
        description: 'A swirling portal of magical energy appears before you',
        chance: 0.02, // 2% chance
        type: 'teleport',
        minLevel: 6,
        locations: ['ruins', 'mountain', 'desert'],
        outcomes: [
            {
                chance: 0.5,
                result: 'beneficial_teleport',
                reward: { location_unlock: 'random', items: ['Teleport Crystal'] },
                message: 'The portal transports you to a new realm! New location discovered!'
            },
            {
                chance: 0.3,
                result: 'neutral_teleport',
                effect: { random_location: true },
                message: 'You are randomly teleported to another location!'
            },
            {
                chance: 0.2,
                result: 'dangerous_teleport',
                penalty: { hp_loss: 30, mana_loss: 20 },
                message: 'The unstable portal damages you during transport!'
            }
        ]
    },

    fairy_ring: {
        name: 'Fairy Ring',
        emoji: '🍄',
        description: 'You find a circle of magical mushrooms',
        chance: 0.03, // 3% chance
        type: 'pet_event',
        minLevel: 2,
        locations: ['forest', 'swamp'],
        outcomes: [
            {
                chance: 0.4,
                reward: { pet_loyalty: 15, all_pets: true },
                message: 'The fairy magic increases all your pets\' loyalty!'
            },
            {
                chance: 0.3,
                reward: { pet_xp: 100, active_pet: true },
                message: 'Your active pet gains experience from fairy magic!'
            },
            {
                chance: 0.2,
                reward: { pet_find_chance: 0.1 },
                message: 'The fairies bless you! Next pet encounter chance increased!'
            },
            {
                chance: 0.1,
                reward: { rare_pet_encounter: true },
                message: 'A rare magical creature is attracted by the fairy ring!'
            }
        ]
    },

    time_rift: {
        name: 'Temporal Rift',
        emoji: '⏰',
        description: 'Time itself seems unstable in this area...',
        chance: 0.015, // 1.5% chance (very rare)
        type: 'special',
        minLevel: 8,
        locations: ['ruins', 'mountain'],
        outcomes: [
            {
                chance: 0.4,
                result: 'experience_boost',
                reward: { xp_multiplier: 2.0, duration: 5 },
                message: 'Time acceleration! Double XP for next 5 battles!'
            },
            {
                chance: 0.3,
                result: 'skill_cooldown_reset',
                reward: { reset_cooldowns: true },
                message: 'Time rewinds! All skill cooldowns are reset!'
            },
            {
                chance: 0.2,
                result: 'age_backwards',
                reward: { level_up_discount: 0.5 },
                message: 'You feel younger! Next level requires 50% less XP!'
            },
            {
                chance: 0.1,
                result: 'time_loop',
                penalty: { repeat_last_battle: true },
                message: 'Time loops! You must repeat your last battle...'
            }
        ]
    }
};

const encounters = [
    // Common enemies (60% spawn rate)
    { name: 'Slime', image: '🟢', xp: 20, gold: 10, attack: 8, hp: 25, rarity: 'common', loot: ['Health Potion'] },
    {
        name: 'Goblin',
        image: '👺',
        xp: 35,
        gold: 25,
        attack: 12,
        hp: 40,
        rarity: 'common',
        loot: ['Bronze Dagger', 'Gold Coins']
    },
    {
        name: 'Wolf',
        image: '🐺',
        xp: 40,
        gold: 20,
        attack: 15,
        hp: 35,
        rarity: 'common',
        loot: ['Wolf Pelt', 'Health Potion']
    },

    // Uncommon enemies (30% spawn rate)
    {
        name: 'Orc Warrior',
        image: '👹',
        xp: 60,
        gold: 40,
        attack: 20,
        hp: 60,
        rarity: 'uncommon',
        loot: ['Iron Axe', 'Shield']
    },
    {
        name: 'Dark Mage',
        image: '🧙‍♂️',
        xp: 70,
        gold: 50,
        attack: 25,
        hp: 45,
        rarity: 'uncommon',
        loot: ['Magic Staff', 'Mana Potion']
    },
    {
        name: 'Skeleton Knight',
        image: '💀',
        xp: 65,
        gold: 45,
        attack: 22,
        hp: 55,
        rarity: 'uncommon',
        loot: ['Bone Sword', 'Ancient Coin']
    },

    // Rare enemies (8% spawn rate)
    {
        name: 'Troll Champion',
        image: '👹',
        xp: 120,
        gold: 80,
        attack: 35,
        hp: 100,
        rarity: 'rare',
        loot: ['Troll Club', 'Rare Gem']
    },
    {
        name: 'Fire Elemental',
        image: '🔥',
        xp: 110,
        gold: 75,
        attack: 30,
        hp: 80,
        rarity: 'rare',
        loot: ['Flame Sword', 'Fire Crystal']
    },

    // Epic boss (2% spawn rate)
    {
        name: 'Ancient Dragon',
        image: '🐉',
        xp: 300,
        gold: 200,
        attack: 50,
        hp: 200,
        rarity: 'boss',
        loot: ['Dragon Blade', 'Dragon Scale Armor', 'Legendary Gem']
    }
];

const equipment = {
    weapons: [
        { name: 'Iron Sword', attack: 10, cost: 100, rarity: 'common' },
        { name: 'Bronze Dagger', attack: 8, cost: 75, rarity: 'common' },
        { name: 'Steel Sword', attack: 18, cost: 250, rarity: 'uncommon' },
        { name: 'Iron Axe', attack: 22, cost: 300, rarity: 'uncommon' },
        { name: 'Magic Staff', attack: 25, cost: 400, rarity: 'rare' },
        { name: 'Flame Sword', attack: 30, cost: 600, rarity: 'rare' },
        { name: 'Dragon Blade', attack: 45, cost: 1500, rarity: 'legendary' }
    ],
    armor: [
        { name: 'Leather Armor', defense: 5, cost: 80, rarity: 'common' },
        { name: 'Chain Mail', defense: 12, cost: 200, rarity: 'uncommon' },
        { name: 'Steel Plate', defense: 20, cost: 500, rarity: 'rare' },
        { name: 'Dragon Scale Armor', defense: 35, cost: 2000, rarity: 'legendary' }
    ]
};

const characterClasses = {
    warrior: {
        name: '🗡️ Warrior',
        description: 'Master of melee combat with high HP and defense',
        bonuses: { hp: 20, attack: 5, defense: 3, mana: -10 },
        skills: ['berserker_rage', 'shield_bash', 'war_cry'],
        ultimate: 'devastating_blow'
    },
    archer: {
        name: '🏹 Archer',
        description: 'Expert marksman with high critical hit chance',
        bonuses: { hp: 0, attack: 3, defense: 0, critChance: 15, mana: 0 },
        skills: ['multi_shot', 'aimed_shot', 'evasion'],
        ultimate: 'arrow_storm'
    },
    mage: {
        name: '🧙‍♂️ Mage',
        description: 'Wielder of arcane magic with powerful spells',
        bonuses: { hp: -10, attack: 2, defense: -2, mana: 30 },
        skills: ['fireball', 'heal', 'magic_shield'],
        ultimate: 'meteor'
    },
    rogue: {
        name: '🗡️ Rogue',
        description: 'Stealthy assassin with high dodge and critical hits',
        bonuses: { hp: -5, attack: 4, defense: 0, critChance: 10, dodgeChance: 15, mana: 5 },
        skills: ['backstab', 'stealth', 'poison_blade'],
        ultimate: 'shadow_strike'
    }
};

const skills = {
    // Warrior Skills
    berserker_rage: {
        name: '🔥 Berserker Rage',
        description: '+50% attack for 3 turns',
        manaCost: 15,
        cooldown: 5,
        effect: 'buff_attack'
    },
    shield_bash: {
        name: '🛡️ Shield Bash',
        description: 'Attack that reduces enemy attack',
        manaCost: 10,
        cooldown: 3,
        effect: 'debuff_enemy_attack'
    },
    war_cry: {
        name: '📢 War Cry',
        description: 'Intimidate enemy, reduce their accuracy',
        manaCost: 8,
        cooldown: 4,
        effect: 'debuff_enemy_accuracy'
    },
    devastating_blow: {
        name: '💥 Devastating Blow',
        description: 'Ultimate: 300% damage attack',
        manaCost: 30,
        cooldown: 8,
        effect: 'ultimate_attack'
    },

    // Archer Skills
    multi_shot: {
        name: '🏹 Multi Shot',
        description: 'Hit enemy 2-3 times with reduced damage',
        manaCost: 12,
        cooldown: 3,
        effect: 'multi_attack'
    },
    aimed_shot: {
        name: '🎯 Aimed Shot',
        description: 'Guaranteed critical hit',
        manaCost: 15,
        cooldown: 4,
        effect: 'guaranteed_crit'
    },
    evasion: {
        name: '💨 Evasion',
        description: '+75% dodge chance for 2 turns',
        manaCost: 10,
        cooldown: 5,
        effect: 'buff_dodge'
    },
    arrow_storm: {
        name: '🌪️ Arrow Storm',
        description: 'Ultimate: 5 attacks with increasing damage',
        manaCost: 35,
        cooldown: 10,
        effect: 'ultimate_multi'
    },

    // Mage Skills
    fireball: {
        name: '🔥 Fireball',
        description: 'Magic damage that ignores armor',
        manaCost: 12,
        cooldown: 2,
        effect: 'magic_damage'
    },
    heal: {
        name: '💚 Heal',
        description: 'Restore 40% of max HP',
        manaCost: 15,
        cooldown: 4,
        effect: 'heal_self'
    },
    magic_shield: {
        name: '🔮 Magic Shield',
        description: 'Absorb next 2 attacks completely',
        manaCost: 20,
        cooldown: 6,
        effect: 'magic_shield'
    },
    meteor: {
        name: '☄️ Meteor',
        description: 'Ultimate: Massive magic damage',
        manaCost: 40,
        cooldown: 12,
        effect: 'ultimate_magic'
    },

    // Rogue Skills
    backstab: {
        name: '🗡️ Backstab',
        description: 'High damage with guaranteed critical',
        manaCost: 15,
        cooldown: 4,
        effect: 'backstab_attack'
    },
    stealth: {
        name: '👤 Stealth',
        description: 'Next attack deals double damage',
        manaCost: 12,
        cooldown: 5,
        effect: 'stealth_buff'
    },
    poison_blade: {
        name: '☠️ Poison Blade',
        description: 'Poison enemy for damage over time',
        manaCost: 10,
        cooldown: 3,
        effect: 'apply_poison'
    },
    shadow_strike: {
        name: '🌑 Shadow Strike',
        description: 'Ultimate: Teleport attack with massive damage',
        manaCost: 35,
        cooldown: 10,
        effect: 'ultimate_stealth'
    },

    // Advanced Combat Skills (unlocked at higher levels)
    weapon_mastery: {
        name: '⚔️ Weapon Mastery',
        description: 'Passive: +15% critical hit chance',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_crit_boost',
        type: 'passive',
        unlockLevel: 8
    },
    armor_expertise: {
        name: '🛡️ Armor Expertise',
        description: 'Passive: Reduce all damage by 20%',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_damage_reduction',
        type: 'passive',
        unlockLevel: 10
    },
    mana_efficiency: {
        name: '🔮 Mana Efficiency',
        description: 'Passive: All skills cost 25% less mana',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_mana_reduction',
        type: 'passive',
        unlockLevel: 12
    },
    battle_reflexes: {
        name: '💨 Battle Reflexes',
        description: 'Passive: +20% dodge chance and first strike in combat',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_reflexes',
        type: 'passive',
        unlockLevel: 15
    },

    // Exploration and Utility Skills
    treasure_hunter: {
        name: '💎 Treasure Hunter',
        description: 'Passive: +30% better treasure find rates',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_treasure_bonus',
        type: 'passive',
        unlockLevel: 6
    },
    resourceful: {
        name: '🌿 Resourceful',
        description: 'Passive: +25% more resources from exploration',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_resource_bonus',
        type: 'passive',
        unlockLevel: 7
    },
    beast_whisperer: {
        name: '🐾 Beast Whisperer',
        description: 'Passive: Pets gain loyalty faster and find rate +50%',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_pet_bonus',
        type: 'passive',
        unlockLevel: 9
    },
    ancient_knowledge: {
        name: '📚 Ancient Knowledge',
        description: 'Passive: +40% XP gain and unlock advanced recipes',
        manaCost: 0,
        cooldown: 0,
        effect: 'passive_xp_bonus',
        type: 'passive',
        unlockLevel: 11
    },

    // Elemental Skills (available to all classes at high levels)
    lightning_bolt: {
        name: '⚡ Lightning Bolt',
        description: 'Fast electric attack that can chain to other enemies',
        manaCost: 18,
        cooldown: 3,
        effect: 'lightning_damage',
        unlockLevel: 13
    },
    ice_shard: {
        name: '🧊 Ice Shard',
        description: 'Freezes enemy, reducing their speed for 2 turns',
        manaCost: 16,
        cooldown: 4,
        effect: 'ice_damage_slow',
        unlockLevel: 14
    },
    earth_spike: {
        name: '🪨 Earth Spike',
        description: 'Rock attack that can stun enemies',
        manaCost: 20,
        cooldown: 5,
        effect: 'earth_damage_stun',
        unlockLevel: 16
    },

    // Master Skills (very high level)
    time_manipulation: {
        name: '⏰ Time Manipulation',
        description: 'Reset all cooldowns and gain extra turn',
        manaCost: 50,
        cooldown: 15,
        effect: 'time_magic',
        unlockLevel: 18
    },
    divine_intervention: {
        name: '✨ Divine Intervention',
        description: 'Fully heal and become immune for 1 turn',
        manaCost: 60,
        cooldown: 20,
        effect: 'divine_heal',
        unlockLevel: 20
    },
    reality_break: {
        name: '🌌 Reality Break',
        description: 'Ultimate: Deal 1000% damage, ignoring all defenses',
        manaCost: 80,
        cooldown: 25,
        effect: 'reality_damage',
        unlockLevel: 25
    }
};

const quests = {
    // Castle Quests
    royal_duty: {
        id: 'royal_duty',
        name: 'Royal Duty',
        description: 'Prove your worth to the castle by defeating 5 enemies',
        type: 'kill',
        location: 'castle',
        giver: 'Castle Captain',
        requirements: { kills: 5 },
        rewards: { xp: 100, gold: 150, item: 'Knight\'s Blade' },
        unlockCondition: { level: 2 },
        completed: false
    },

    // Forest Quests
    forest_guardian: {
        id: 'forest_guardian',
        name: 'Guardian of the Woods',
        description: 'Collect 3 Forest Essence to appease the Forest Guardian',
        type: 'collect',
        location: 'forest',
        giver: 'Elder Druid',
        requirements: { items: { 'Forest Essence': 3 } },
        rewards: { xp: 200, gold: 100, item: 'Nature\'s Blessing', unlocks: 'swamp' },
        unlockCondition: { level: 4 },
        completed: false
    },

    // Village Quests
    merchant_problems: {
        id: 'merchant_problems',
        name: 'Merchant\'s Problems',
        description: 'Clear the trade routes by defeating bandits near the village',
        type: 'location_clear',
        location: 'village',
        giver: 'Merchant Leader',
        requirements: { battles_in_location: { village: 8 } },
        rewards: { xp: 150, gold: 300, item: 'Merchant\'s Ring' },
        unlockCondition: { level: 3 },
        completed: false
    },

    // Mountain Quests
    dragon_peak_trial: {
        id: 'dragon_peak_trial',
        name: 'Trial of the Peak',
        description: 'Defeat the Mountain Dragon to prove your strength',
        type: 'boss',
        location: 'mountain',
        giver: 'Mountain Sage',
        requirements: { boss_defeat: 'Mountain Dragon' },
        rewards: { xp: 500, gold: 400, item: 'Dragon Slayer Title', unlocks: 'ruins' },
        unlockCondition: { level: 10, bossesDefeated: 1 },
        completed: false
    },

    // Swamp Quests
    witch_bargain: {
        id: 'witch_bargain',
        name: 'The Witch\'s Bargain',
        description: 'Bring the Swamp Witch 5 Rare Crystals from the caverns',
        type: 'collect',
        location: 'swamp',
        giver: 'Swamp Witch',
        requirements: { items: { 'Rare Crystals': 5 } },
        rewards: { xp: 300, gold: 200, item: 'Witch\'s Potion', skill: 'poison_resistance' },
        unlockCondition: { level: 7, questCompleted: 'forest_guardian' },
        completed: false
    },

    // Desert Quests
    desert_nomad: {
        id: 'desert_nomad',
        name: 'The Desert Nomad\'s Test',
        description: 'Survive 10 battles in the scorching desert',
        type: 'survival',
        location: 'desert',
        giver: 'Desert Nomad',
        requirements: { desert_battles: 10 },
        rewards: { xp: 400, gold: 350, item: 'Desert Cloak', skill: 'heat_resistance' },
        unlockCondition: { level: 12 },
        completed: false
    },

    // Ruins Quests
    ancient_secret: {
        id: 'ancient_secret',
        name: 'Ancient Secrets',
        description: 'Uncover the mystery of the lost civilization',
        type: 'explore',
        location: 'ruins',
        giver: 'Ancient Spirit',
        requirements: { ruins_explored: 15, artifacts_found: 3 },
        rewards: { xp: 600, gold: 500, item: 'Ancient Wisdom', ultimate_skill: true },
        unlockCondition: { level: 15, questCompleted: 'dragon_peak_trial' },
        completed: false
    }
};

// eslint-disable-next-line no-unused-vars
const dailyQuests = [
    {
        name: 'Daily Hunt',
        description: 'Defeat 3 enemies of any type',
        requirements: { daily_kills: 3 },
        rewards: { xp: 50, gold: 75 },
        refreshes: 'daily'
    },
    {
        name: 'Resource Gatherer',
        description: 'Collect 2 resources from any location',
        requirements: { daily_resources: 2 },
        rewards: { xp: 40, gold: 100 },
        refreshes: 'daily'
    },
    {
        name: 'Skill Practice',
        description: 'Use 5 skills in combat',
        requirements: { daily_skills: 5 },
        rewards: { xp: 60, gold: 50 },
        refreshes: 'daily'
    }
];

const achievements = [
    { id: 'first_kill', name: 'First Blood', description: 'Defeat your first enemy', reward: 50 },
    { id: 'explorer', name: 'Explorer', description: 'Explore 10 locations', reward: 100 },
    { id: 'treasure_hunter', name: 'Treasure Hunter', description: 'Find 500 gold', reward: 200 },
    { id: 'level_master', name: 'Level Master', description: 'Reach level 10', reward: 500 },
    { id: 'dragon_slayer', name: 'Dragon Slayer', description: 'Defeat the Ancient Dragon', reward: 1000 },
    { id: 'boss_hunter', name: 'Boss Hunter', description: 'Defeat 5 boss enemies', reward: 750 },
    { id: 'skill_master', name: 'Skill Master', description: 'Use 50 skills in combat', reward: 300 },
    { id: 'class_master', name: 'Class Master', description: 'Master your chosen class', reward: 500 },
    { id: 'quest_master', name: 'Quest Master', description: 'Complete 5 quests', reward: 400 },
    { id: 'location_master', name: 'Location Master', description: 'Unlock all locations', reward: 800 }
];

// Weather System Functions
function getCurrentWeather(state) {
    return weatherTypes[state.currentWeather] || weatherTypes.clear;
}

function updateWeather(state) {
    state.weatherChangeTimer = (state.weatherChangeTimer || 0) + 1;

    if (state.weatherChangeTimer >= state.weatherDuration) {
        state.weatherChangeTimer = 0;
        state.currentWeather = selectRandomWeather();

        const weather = getCurrentWeather(state);
        showMessage(`🌤️ Weather changed to: ${weather.emoji} ${weather.name}`, 'info');

        return true; // Weather changed
    }
    return false; // No change
}

function selectRandomWeather() {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const [weatherType, data] of Object.entries(weatherTypes)) {
        cumulativeProbability += data.rarity;
        if (rand <= cumulativeProbability) {
            return weatherType;
        }
    }

    return 'clear'; // Fallback
}

function applyWeatherEffects(baseValue, effectType, state) {
    const weather = getCurrentWeather(state);
    const effect = weather.effects[effectType] || 1.0;
    return Math.floor(baseValue * effect);
}

function getWeatherDescription(state) {
    const weather = getCurrentWeather(state);
    return `${weather.emoji} ${weather.name}: ${weather.description}`;
}

// Pet System Functions
function tryFindPet(state, currentLocation) {
    // Check if player can find pets in this location
    const availablePets = Object.entries(petTypes).filter(([, petData]) => {
        return petData.locations.includes(currentLocation) &&
               state.level >= petData.unlockLevel &&
               !state.pets.some(pet => pet.type === petData.name);
    });

    if (availablePets.length === 0) return null;

    // Check each pet's individual find chance
    for (const [petKey, petData] of availablePets) {
        if (Math.random() < petData.findChance) {
            return createNewPet(petKey, petData);
        }
    }

    return null;
}

function createNewPet(petKey, petData) {
    return {
        id: Date.now() + Math.random(), // Unique ID
        type: petKey,
        name: petData.name,
        emoji: petData.emoji,
        level: 1,
        xp: 0,
        xpNeeded: 100,
        loyalty: petData.baseStats.loyalty,
        maxLoyalty: 100,
        health: petData.baseStats.health,
        maxHealth: petData.baseStats.health,
        attack: petData.baseStats.attack,
        defense: petData.baseStats.defense,
        abilities: [...petData.abilities],
        rarity: petData.rarity,
        description: petData.description,
        isActive: false
    };
}

function levelUpPet(pet) {
    const petData = petTypes[pet.type];
    if (!petData || pet.level >= petData.maxLevel) return false;

    pet.level++;
    pet.xp = 0;
    pet.xpNeeded = Math.floor(pet.xpNeeded * petData.growthRate);

    // Stat increases
    pet.maxHealth += Math.floor(petData.baseStats.health * 0.2);
    pet.health = pet.maxHealth; // Full heal on level up
    pet.attack += Math.floor(petData.baseStats.attack * 0.15);
    pet.defense += Math.floor(petData.baseStats.defense * 0.15);
    pet.maxLoyalty = Math.min(100, pet.maxLoyalty + 5);

    return true;
}

function applyPetBonuses(state, bonusType, baseValue) {
    if (!state.activePet) return baseValue;

    const pet = state.pets.find(p => p.id === state.activePet);
    if (!pet) return baseValue;

    let modifier = 1.0;

    pet.abilities.forEach(abilityKey => {
        const ability = petAbilities[abilityKey];
        if (!ability || ability.type !== 'passive') return;

        switch (ability.effect) {
        case 'treasure_bonus':
            if (bonusType === 'treasure') modifier += ability.value;
            break;
        case 'xp_bonus':
            if (bonusType === 'xp') modifier += ability.value;
            break;
        case 'crit_chance_increase':
            if (bonusType === 'crit') modifier += ability.value / 100;
            break;
        case 'max_mana_increase':
            if (bonusType === 'mana') modifier += ability.value;
            break;
        }
    });

    return Math.floor(baseValue * modifier);
}

function petPostBattleEffects(state) {
    if (!state.activePet) return '';

    const pet = state.pets.find(p => p.id === state.activePet);
    if (!pet) return '';

    let effects = '';

    pet.abilities.forEach(abilityKey => {
        const ability = petAbilities[abilityKey];
        if (!ability || ability.type !== 'passive') return;

        if (ability.effect === 'post_battle_heal') {
            const healAmount = Math.min(ability.value, state.maxHp - state.hp);
            if (healAmount > 0) {
                state.hp += healAmount;
                effects += `${pet.emoji} ${pet.name} heals you for ${healAmount} HP!\n`;
            }
        }
    });

    return effects;
}

function increasePetLoyalty(pet, amount = 1) {
    pet.loyalty = Math.min(pet.maxLoyalty, pet.loyalty + amount);
}

function decreasePetLoyalty(pet, amount = 1) {
    pet.loyalty = Math.max(0, pet.loyalty - amount);

    // Pet might leave if loyalty gets too low
    if (pet.loyalty <= 10) {
        return true; // Pet wants to leave
    }
    return false;
}

// Crafting System Functions
function getAvailableRecipes(state) {
    return Object.entries(craftingRecipes).filter(([, recipe]) => {
        return state.level >= recipe.requiredLevel;
    });
}

function canCraftItem(state, recipeKey) {
    const recipe = craftingRecipes[recipeKey];
    if (!recipe || state.level < recipe.requiredLevel) {
        return { canCraft: false, reason: 'Level too low or recipe not found' };
    }

    const inventory = state.inventory || [];
    const missing = [];

    for (const [materialName, needed] of Object.entries(recipe.materials)) {
        const owned = inventory.find(item => item.name === materialName)?.quantity || 0;
        if (owned < needed) {
            missing.push(`${materialName} (${owned}/${needed})`);
        }
    }

    if (missing.length > 0) {
        return { canCraft: false, reason: `Missing: ${missing.join(', ')}` };
    }

    return { canCraft: true, reason: 'All materials available' };
}

function craftItem(state, recipeKey) {
    const recipe = craftingRecipes[recipeKey];
    const { canCraft, reason } = canCraftItem(state, recipeKey);

    if (!canCraft) {
        return { success: false, message: `Cannot craft: ${reason}` };
    }

    // Remove materials from inventory
    const inventory = state.inventory || [];
    for (const [materialName, needed] of Object.entries(recipe.materials)) {
        const item = inventory.find(item => item.name === materialName);
        if (item) {
            item.quantity -= needed;
            if (item.quantity <= 0) {
                const index = inventory.indexOf(item);
                inventory.splice(index, 1);
            }
        }
    }

    // Create the crafted item
    const craftedItem = {
        name: recipe.name,
        type: recipe.type,
        rarity: recipe.rarity,
        description: recipe.description,
        crafted: true,
        ...recipe
    };

    // Add to inventory or equip if it's better
    if (recipe.type === 'weapon' || recipe.type === 'armor') {
        const currentEquipment = state.equipment?.[recipe.type];
        const isUpgrade = !currentEquipment ||
                         (recipe.attack && recipe.attack > (currentEquipment.attack || 0)) ||
                         (recipe.defense && recipe.defense > (currentEquipment.defense || 0));

        if (isUpgrade) {
            // Auto-equip if it's better
            state.equipment = state.equipment || {};
            state.equipment[recipe.type] = craftedItem;

            // Apply stat bonuses
            if (recipe.attack) state.attack = (state.attack || 15) + (recipe.attack - (currentEquipment?.attack || 0));
            if (recipe.defense) state.defense = (state.defense || 5) + (recipe.defense - (currentEquipment?.defense || 0));
            if (recipe.manaBonus) state.maxMana = (state.maxMana || 50) + recipe.manaBonus;
            if (recipe.hpBonus) {
                state.maxHp += recipe.hpBonus;
                state.hp += recipe.hpBonus; // Bonus HP when equipped
            }

            return {
                success: true,
                message: `✨ Crafted and equipped ${recipe.name}!`,
                equipped: true
            };
        } else {
            inventory.push(craftedItem);
            return {
                success: true,
                message: `🔨 Crafted ${recipe.name}! Added to inventory.`,
                equipped: false
            };
        }
    } else {
        // Consumables and other items go to inventory
        inventory.push(craftedItem);
        return {
            success: true,
            message: `🔨 Crafted ${recipe.name}! Added to inventory.`,
            equipped: false
        };
    }
}

function useCraftedItem(state, itemName) {
    const inventory = state.inventory || [];
    const item = inventory.find(i => i.name === itemName && i.crafted);

    if (!item) {
        return { success: false, message: 'Item not found' };
    }

    const result = { success: true, message: '' };

    switch (item.effect) {
    case 'heal':
        const healAmount = Math.min(item.value, state.maxHp - state.hp);
        state.hp += healAmount;
        result.message = `Restored ${healAmount} HP!`;
        break;

    case 'mana':
        const manaAmount = Math.min(item.value, state.maxMana - state.mana);
        state.mana += manaAmount;
        state.maxMana += 20; // Temporary bonus
        result.message = `Restored ${manaAmount} mana and increased max mana by 20!`;
        break;

    case 'loyalty':
        if (state.activePet && state.pets) {
            const pet = state.pets.find(p => p.id === state.activePet);
            if (pet) {
                pet.loyalty = Math.min(pet.maxLoyalty, pet.loyalty + item.value);
                result.message = `${pet.name} loyalty increased by ${item.value}!`;
            } else {
                return { success: false, message: 'No active pet to feed' };
            }
        } else {
            return { success: false, message: 'No active pet to feed' };
        }
        break;

    case 'buff':
        // Apply temporary buff (implementation depends on battle system)
        state.temporaryBuffs = state.temporaryBuffs || {};
        state.temporaryBuffs.attack = (state.temporaryBuffs.attack || 0) + item.value.attack;
        state.temporaryBuffs.duration = item.value.duration;
        result.message = `Attack increased by ${item.value.attack} for ${item.value.duration} battles!`;
        break;

    default:
        return { success: false, message: 'Unknown item effect' };
    }

    // Remove item from inventory (consumables are used up)
    const index = inventory.indexOf(item);
    inventory.splice(index, 1);

    return result;
}

// Random Events System Functions
function tryTriggerRandomEvent(state, currentLocation) {
    // Check if a random event should occur (small chance)
    const eventChance = Math.random();
    if (eventChance > 0.08) return null; // 8% chance for any event

    // Filter events by location and level
    const availableEvents = Object.entries(randomEvents).filter(([, event]) => {
        return event.locations.includes(currentLocation) &&
               state.level >= event.minLevel &&
               Math.random() < event.chance;
    });

    if (availableEvents.length === 0) return null;

    // Pick a random available event
    const [eventKey, eventData] = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    return { key: eventKey, data: eventData };
}

function processRandomEvent(state, eventKey, eventData, choice = null) {
    let message = `✨ RANDOM EVENT ✨\n\n${eventData.emoji} ${eventData.name}\n\n${eventData.description}\n\n`;

    switch (eventData.type) {
    case 'choice':
        if (choice === null) {
            // Present choices to player
            message += 'What do you do?\n\n';
            eventData.choices.forEach((choiceOption, index) => {
                message += `${index + 1}. ${choiceOption.text}\n`;
                message += `   ${choiceOption.requirementText}\n\n`;
            });
            return { type: 'choice', message, choices: eventData.choices };
        } else {
            // Process chosen option
            const chosenOption = eventData.choices[choice];
            return processEventChoice(state, chosenOption, message);
        }

    case 'risk_reward':
        return processRiskRewardEvent(state, eventData, message);

    case 'beneficial':
        return processBeneficialEvent(state, eventData, message);

    case 'teleport':
        return processTeleportEvent(state, eventData, message);

    case 'pet_event':
        return processPetEvent(state, eventData, message);

    case 'special':
        return processSpecialEvent(state, eventData, message);

    default:
        return { type: 'message', message: message + 'Something strange happens...' };
    }
}

function processEventChoice(state, choice, baseMessage) {
    let message = baseMessage;
    let canAfford = true;

    // Check if player can afford the choice
    if (choice.cost.gold && state.gold < choice.cost.gold) {
        canAfford = false;
        message += `❌ You need ${choice.cost.gold} gold but only have ${state.gold}.`;
    }

    if (choice.cost.mana && state.mana < choice.cost.mana) {
        canAfford = false;
        message += `❌ You need ${choice.cost.mana} mana but only have ${state.mana}.`;
    }

    if (choice.cost.resources) {
        const inventory = state.inventory || [];
        const resourceCount = inventory.filter(item => item.type === 'resource').length;
        if (resourceCount < choice.cost.resources) {
            canAfford = false;
            message += `❌ You need ${choice.cost.resources} resources but only have ${resourceCount}.`;
        }
    }

    if (!canAfford) {
        return { type: 'message', message };
    }

    // Deduct costs
    if (choice.cost.gold) state.gold -= choice.cost.gold;
    if (choice.cost.mana) state.mana -= choice.cost.mana;
    if (choice.cost.resources) {
        // Remove random resources
        const inventory = state.inventory || [];
        const resources = inventory.filter(item => item.type === 'resource');
        for (let i = 0; i < choice.cost.resources && resources.length > 0; i++) {
            const randomResource = resources[Math.floor(Math.random() * resources.length)];
            randomResource.quantity = (randomResource.quantity || 1) - 1;
            if (randomResource.quantity <= 0) {
                const index = inventory.indexOf(randomResource);
                inventory.splice(index, 1);
            }
            resources.splice(resources.indexOf(randomResource), 1);
        }
    }

    // Apply rewards
    message += applyEventReward(state, choice.reward);

    return { type: 'message', message };
}

function applyEventReward(state, reward) {
    let rewardMessage = '';

    switch (reward.type) {
    case 'nothing':
        rewardMessage = 'You walk away safely.';
        break;

    case 'blessing':
        if (reward.effect === 'hp_boost') {
            state.maxHp += reward.value;
            state.hp += reward.value;
            rewardMessage = `🙏 The shrine blesses you! +${reward.value} max HP permanently!`;
        } else if (reward.effect === 'attack_boost') {
            state.attack += reward.value;
            rewardMessage = `⚔️ The shrine strengthens you! +${reward.value} attack permanently!`;
        }
        break;

    case 'random_equipment':
        const rarityItems = equipment.weapons.filter(item => item.rarity === reward.rarity)
            .concat(equipment.armor.filter(item => item.rarity === reward.rarity));
        if (rarityItems.length > 0) {
            const randomItem = rarityItems[Math.floor(Math.random() * rarityItems.length)];
            state.inventory = state.inventory || [];
            state.inventory.push(randomItem);
            rewardMessage = `🎁 The merchant gives you: ${randomItem.name}!`;
        }
        break;

    case 'skill_unlock':
        // Unlock a random skill (implementation depends on skill system)
        rewardMessage = '📚 You learn ancient knowledge! (Skill system enhancement needed)';
        break;

    default:
        rewardMessage = '✨ Something magical happens!';
    }

    return rewardMessage;
}

function processRiskRewardEvent(state, eventData, baseMessage) {
    const roll = Math.random();
    let cumulativeChance = 0;

    for (const outcome of eventData.outcomes) {
        cumulativeChance += outcome.chance;
        if (roll <= cumulativeChance) {
            let message = baseMessage + outcome.message + '\n\n';

            if (outcome.result === 'success' && outcome.reward) {
                if (outcome.reward.gold) {
                    const goldAmount = Array.isArray(outcome.reward.gold)
                        ? Math.floor(Math.random() * (outcome.reward.gold[1] - outcome.reward.gold[0])) + outcome.reward.gold[0]
                        : outcome.reward.gold;
                    state.gold += goldAmount;
                    message += `💰 +${goldAmount} gold!\n`;
                }

                if (outcome.reward.items) {
                    state.inventory = state.inventory || [];
                    outcome.reward.items.forEach(itemName => {
                        state.inventory.push({ name: itemName, type: 'treasure', rarity: 'rare' });
                        message += `🎁 Found: ${itemName}!\n`;
                    });
                }
            } else if (outcome.result === 'curse' && outcome.penalty) {
                if (outcome.penalty.hp_drain) {
                    state.hp = Math.max(1, state.hp - outcome.penalty.hp_drain);
                    message += `💀 Lost ${outcome.penalty.hp_drain} HP!\n`;
                }

                if (outcome.penalty.curse_duration) {
                    state.cursed = outcome.penalty.curse_duration;
                    message += `😈 Cursed for ${outcome.penalty.curse_duration} explorations!\n`;
                }
            } else if (outcome.result === 'mimic') {
                // Trigger a battle with mimic
                message += '⚔️ Prepare for battle!';
                // This would need integration with the battle system
            }

            return { type: 'message', message };
        }
    }

    return { type: 'message', message: baseMessage + 'Nothing happens...' };
}

function processBeneficialEvent(state, eventData, baseMessage) {
    const roll = Math.random();
    let cumulativeChance = 0;

    for (const outcome of eventData.outcomes) {
        cumulativeChance += outcome.chance;
        if (roll <= cumulativeChance) {
            let message = baseMessage + outcome.message + '\n\n';

            if (outcome.reward.xp) {
                const xpAmount = Array.isArray(outcome.reward.xp)
                    ? Math.floor(Math.random() * (outcome.reward.xp[1] - outcome.reward.xp[0])) + outcome.reward.xp[0]
                    : outcome.reward.xp;
                state.xp += xpAmount;
                message += `✨ +${xpAmount} XP!`;
            }

            return { type: 'message', message };
        }
    }

    return { type: 'message', message: baseMessage + 'The scholar nods and continues on his way.' };
}

function processTeleportEvent(state, eventData, baseMessage) {
    // Implementation for teleport events
    return { type: 'message', message: baseMessage + 'The portal shimmers and fades away...' };
}

function processPetEvent(state, eventData, baseMessage) {
    // Implementation for pet-related events
    return { type: 'message', message: baseMessage + 'The magical energy affects your companions...' };
}

function processSpecialEvent(state, eventData, baseMessage) {
    // Implementation for special temporal events
    return { type: 'message', message: baseMessage + 'Time itself bends around you...' };
}

function loadGame() {
    updateGameDisplay();
    updateLocationSelector();
    updateQuestDisplay();
}

function updateLocationSelector() {
    const state = dataManager.getGameState();
    const locationGrid = document.getElementById('location-grid');

    if (!locationGrid) return;

    locationGrid.innerHTML = '';

    for (const locationId in gameScenarios) {
        const location = gameScenarios[locationId];
        const isUnlocked = state.unlockedLocations.includes(locationId);
        const isActive = state.currentLocation === locationId;
        const canAccess = !location.levelRequirement || state.level >= location.levelRequirement;

        const locationCard = document.createElement('div');
        locationCard.className = 'location-card';

        if (isActive) {
            locationCard.classList.add('active');
        } else if (!isUnlocked || !canAccess) {
            locationCard.classList.add('locked');
        }

        locationCard.innerHTML = `
            <span class="location-emoji">${location.image}</span>
            <div class="location-name">${locationId.charAt(0).toUpperCase() + locationId.slice(1)}</div>
            <div class="location-level">
                ${location.levelRequirement ? `Level ${location.levelRequirement}+` : 'Available'}
            </div>
        `;

        if (isUnlocked && canAccess) {
            locationCard.addEventListener('click', () => selectLocation(locationId));
        }

        locationGrid.appendChild(locationCard);
    }
}

function selectLocation(locationId) {
    const state = dataManager.getGameState();
    state.currentLocation = locationId;
    dataManager.saveGameState(state);
    updateLocationSelector();

    const locationData = gameScenarios[locationId];
    document.getElementById('game-message').textContent =
        `You are now at: ${locationId.charAt(0).toUpperCase() + locationId.slice(1)}\n\n${locationData.description}`;
    document.getElementById('game-image').textContent = locationData.image;
}

function updateQuestDisplay() {
    const state = dataManager.getGameState();
    const activeQuestsDiv = document.getElementById('active-quests');
    const availableQuestsDiv = document.getElementById('available-quests');

    if (!activeQuestsDiv || !availableQuestsDiv) return;

    // Update active quests
    activeQuestsDiv.innerHTML = '';
    if (state.activeQuests && state.activeQuests.length > 0) {
        state.activeQuests.forEach(questId => {
            const quest = quests[questId];
            if (quest) {
                const { progress, isComplete } = dataManager.checkQuestProgress(questId, state);
                const questElement = createQuestElement(quest, progress, isComplete, false);
                activeQuestsDiv.appendChild(questElement);
            }
        });
    } else {
        activeQuestsDiv.innerHTML = '<div class="empty-message">No active quests</div>';
    }

    // Update available quests
    availableQuestsDiv.innerHTML = '';
    const availableQuests = dataManager.getAvailableQuests();
    if (availableQuests.length > 0) {
        availableQuests.forEach(quest => {
            const questElement = createQuestElement(quest, null, false, true);
            availableQuestsDiv.appendChild(questElement);
        });
    } else {
        availableQuestsDiv.innerHTML = '<div class="empty-message">No quests available</div>';
    }
}

function createQuestElement(quest, progress, isComplete, isAvailable) {
    const questDiv = document.createElement('div');
    questDiv.className = `quest-item ${isAvailable ? 'available' : ''}`;

    let progressText = '';
    if (progress && !isComplete) {
        switch (quest.type) {
        case 'kill':
            progressText = `Progress: ${progress.kills || 0}/${quest.requirements.kills}`;
            break;
        case 'collect': {
            const collectProgress = [];
            for (const item in quest.requirements.items) {
                const needed = quest.requirements.items[item];
                const have = progress[item] || 0;
                collectProgress.push(`${item}: ${have}/${needed}`);
            }
            progressText = `Progress: ${collectProgress.join(', ')}`;
            break;
        }
        case 'location_clear': {
            const locationProgress = [];
            for (const location in quest.requirements.battles_in_location) {
                const needed = quest.requirements.battles_in_location[location];
                const have = progress[location] || 0;
                locationProgress.push(`${location}: ${have}/${needed}`);
            }
            progressText = `Progress: ${locationProgress.join(', ')}`;
            break;
        }
        case 'boss':
            progressText = progress.boss ? 'Boss defeated!' : 'Boss not defeated yet';
            break;
        case 'survival':
            progressText = `Battles: ${progress.battles || 0}/${quest.requirements[quest.location + '_battles']}`;
            break;
        case 'explore': {
            const explored = progress.explored || 0;
            const artifacts = progress.artifacts || 0;
            const ruinsReq = quest.requirements.ruins_explored;
            const artifactsReq = quest.requirements.artifacts_found;
            progressText = `Explored: ${explored}/${ruinsReq}, Artifacts: ${artifacts}/${artifactsReq}`;
            break;
        }
        }
    } else if (isComplete) {
        progressText = '✅ Ready to complete!';
    }

    let rewardsText = '';
    if (quest.rewards) {
        const rewards = [];
        if (quest.rewards.xp) rewards.push(`${quest.rewards.xp} XP`);
        if (quest.rewards.gold) rewards.push(`${quest.rewards.gold} Gold`);
        if (quest.rewards.item) rewards.push(quest.rewards.item);
        if (quest.rewards.unlocks) rewards.push(`Unlocks ${quest.rewards.unlocks}`);
        rewardsText = `Rewards: ${rewards.join(', ')}`;
    }

    questDiv.innerHTML = `
        <div class="quest-name">
            ${quest.name}
            ${isAvailable ? '<button class="accept-quest-btn" onclick="acceptQuest(\'' + quest.id + '\')">Accept</button>' : ''}
        </div>
        <div class="quest-giver">📍 ${quest.giver} (${quest.location})</div>
        <div class="quest-description">${quest.description}</div>
        ${progressText ? `<div class="quest-progress">${progressText}</div>` : ''}
        <div class="quest-rewards">${rewardsText}</div>
    `;

    return questDiv;
}

// eslint-disable-next-line no-unused-vars
function acceptQuest(questId) {
    if (dataManager.acceptQuest(questId)) {
        showMessage(`Quest accepted: ${quests[questId].name}!`, 'success');
        updateQuestDisplay();
    } else {
        showMessage('Failed to accept quest!', 'error');
    }
}

function showQuestDetails() {
    const state = dataManager.getGameState();
    let message = '🎯 QUEST LOG 🎯\n\n';

    // Active Quests
    if (state.activeQuests && state.activeQuests.length > 0) {
        message += '📋 ACTIVE QUESTS:\n';
        state.activeQuests.forEach(questId => {
            const quest = quests[questId];
            if (quest) {
                const { progress, isComplete } = dataManager.checkQuestProgress(questId, state);
                message += `\n• ${quest.name} (${quest.location})\n`;
                message += `  ${quest.description}\n`;

                // Show progress
                if (isComplete) {
                    message += `  ✅ READY TO COMPLETE!\n`;
                } else {
                    switch (quest.type) {
                    case 'kill':
                        message += `  Progress: ${progress.kills || 0}/${quest.requirements.kills} enemies\n`;
                        break;
                    case 'collect':
                        for (const item in quest.requirements.items) {
                            const needed = quest.requirements.items[item];
                            const have = progress[item] || 0;
                            message += `  ${item}: ${have}/${needed}\n`;
                        }
                        break;
                    case 'location_clear':
                        for (const location in quest.requirements.battles_in_location) {
                            const needed = quest.requirements.battles_in_location[location];
                            const have = progress[location] || 0;
                            message += `  ${location} battles: ${have}/${needed}\n`;
                        }
                        break;
                    case 'boss':
                        message += `  ${progress.boss ? '✅' : '❌'} Defeat ${quest.requirements.boss_defeat}\n`;
                        break;
                    }
                }
            }
        });
    } else {
        message += '📋 No active quests\n';
    }

    // Available Quests
    const availableQuests = dataManager.getAvailableQuests();
    if (availableQuests.length > 0) {
        message += '\n\n🔓 AVAILABLE QUESTS:\n';
        availableQuests.forEach(quest => {
            message += `\n• ${quest.name} (${quest.location})\n`;
            message += `  ${quest.description}\n`;
            message += `  Giver: ${quest.giver}\n`;
        });
        message += '\n💡 Visit quest locations to accept new quests!';
    }

    // Completed Quests
    if (state.completedQuests && state.completedQuests.length > 0) {
        message += `\n\n✅ COMPLETED: ${state.completedQuests.length} quests`;
    }

    document.getElementById('game-message').textContent = message;
    document.getElementById('game-image').textContent = '📜';
}

function updateGameDisplay() {
    const state = dataManager.getGameState();

    document.getElementById('hero-name').textContent = state.name;
    document.getElementById('hero-level').textContent = state.level;
    document.getElementById('hero-xp').textContent = state.xp;
    document.getElementById('hero-xp-needed').textContent = state.xpNeeded;
    document.getElementById('hero-hp').textContent = state.hp;
    document.getElementById('hero-max-hp').textContent = state.maxHp;
    document.getElementById('hero-gold').textContent = state.gold;

    // Update new stats if elements exist
    const attackEl = document.getElementById('hero-attack');
    const defenseEl = document.getElementById('hero-defense');
    const weaponEl = document.getElementById('hero-weapon');
    const armorEl = document.getElementById('hero-armor');
    const manaEl = document.getElementById('hero-mana');
    const maxManaEl = document.getElementById('hero-max-mana');
    const classEl = document.getElementById('hero-class');

    if (attackEl) attackEl.textContent = state.attack || 15;
    if (defenseEl) defenseEl.textContent = state.defense || 5;
    if (weaponEl) weaponEl.textContent = state.equipment?.weapon?.name || 'Iron Sword';
    if (armorEl) armorEl.textContent = state.equipment?.armor?.name || 'Leather Armor';
    if (manaEl) manaEl.textContent = state.mana || 50;
    if (maxManaEl) maxManaEl.textContent = state.maxMana || 50;
    if (classEl) classEl.textContent = characterClasses[state.class]?.name || '🗡️ Warrior';

    // Update weather display if element exists
    const weatherEl = document.getElementById('current-weather');
    if (weatherEl) {
        const currentWeather = getCurrentWeather(state);
        weatherEl.textContent = `${currentWeather.emoji} ${currentWeather.name}`;
        weatherEl.title = currentWeather.description; // Tooltip
    }

    // Update pet display if element exists
    const petEl = document.getElementById('active-pet');
    if (petEl) {
        if (state.activePet && state.pets) {
            const activePet = state.pets.find(p => p.id === state.activePet);
            if (activePet) {
                petEl.textContent = `${activePet.emoji} ${activePet.name} (Lv.${activePet.level})`;
                petEl.title = `${activePet.description} • Loyalty: ${activePet.loyalty}/${activePet.maxLoyalty}`;
            } else {
                petEl.textContent = 'None';
                petEl.title = 'No active pet companion';
            }
        } else {
            petEl.textContent = 'None';
            petEl.title = 'No pets found yet';
        }
    }

    // Update battle-specific UI
    updateBattleUI(state);
}

function updateBattleUI(state) {
    const battleUI = document.getElementById('battle-ui');
    const gameActions = document.querySelector('.game-actions');

    if (state.inBattle && state.currentEnemy) {
        // Show battle UI
        if (battleUI) {
            battleUI.style.display = 'block';
            updateEnemyDisplay(state.currentEnemy);
        }

        // Hide normal game actions, show battle actions
        if (gameActions) {
            gameActions.style.display = 'none';
        }

        const battleActions = document.getElementById('battle-actions');
        if (battleActions) {
            battleActions.style.display = 'flex';
        }
    } else {
        // Hide battle UI
        if (battleUI) {
            battleUI.style.display = 'none';
        }

        // Show normal game actions
        if (gameActions) {
            gameActions.style.display = 'flex';
        }

        const battleActions = document.getElementById('battle-actions');
        if (battleActions) {
            battleActions.style.display = 'none';
        }
    }
}

function updateEnemyDisplay(enemy) {
    const enemyNameEl = document.getElementById('enemy-name');
    const enemyHpEl = document.getElementById('enemy-hp');
    const enemyMaxHpEl = document.getElementById('enemy-max-hp');
    const enemyImageEl = document.getElementById('enemy-image');

    if (enemyNameEl) enemyNameEl.textContent = enemy.name;
    if (enemyHpEl) enemyHpEl.textContent = enemy.currentHp || enemy.hp;
    if (enemyMaxHpEl) enemyMaxHpEl.textContent = enemy.hp;
    if (enemyImageEl) enemyImageEl.textContent = enemy.image;
}

function explore() {
    const state = dataManager.getGameState();
    const currentLocation = state.currentLocation || 'castle';
    const locationData = gameScenarios[currentLocation];

    // Check if player can access this location
    if (!state.unlockedLocations.includes(currentLocation)) {
        showMessage(`You cannot access ${currentLocation} yet!`, 'error');
        return;
    }

    // Check level requirement
    if (locationData.levelRequirement && state.level < locationData.levelRequirement) {
        showMessage(`You need to be level ${locationData.levelRequirement} to explore ${currentLocation}!`, 'error');
        return;
    }

    state.explorationCount = (state.explorationCount || 0) + 1;

    // Weather System - Update weather and get current conditions
    updateWeather(state);
    const currentWeather = getCurrentWeather(state);

    // Update quest progress for location exploration
    dataManager.updateQuestProgress('battle_location', { location: currentLocation });

    // Modify encounter chances based on weather
    const baseEncounterChance = Math.random();
    const weatherMod = currentWeather.effects.encounterRateChange || 0;
    const encounterChance = Math.max(0, Math.min(1, baseEncounterChance + weatherMod));

    let message = `${locationData.message}\n\n`;
    message += `🌤️ ${currentWeather.emoji} ${currentWeather.name}: ${currentWeather.description}\n\n`;

    // Special encounters (10% chance)
    if (encounterChance < 0.1 && locationData.specialEncounters.length > 0) {
        const specialEncounter =
            locationData.specialEncounters[Math.floor(Math.random() * locationData.specialEncounters.length)];

        if (specialEncounter.type === 'boss' && Math.random() < 0.3) {
            const bossEnemy = encounters.find(e => e.name === specialEncounter.name);
            if (bossEnemy) {
                message += `⚠️ ${specialEncounter.name} emerges! ${specialEncounter.description}`;
                document.getElementById('game-message').textContent = message;
                document.getElementById('game-image').textContent = locationData.image;
                startBattle(state, bossEnemy);
                dataManager.saveGameState(state);
                return;
            }
        } else if (specialEncounter.type === 'quest_giver') {
            // Check for available quests from this location
            const availableQuests = dataManager.getAvailableQuests().filter(q => q.location === currentLocation);
            if (availableQuests.length > 0) {
                const quest = availableQuests[0];
                message += `🎯 ${quest.giver}: "${quest.description}"\n\nQuest available: ${quest.name}`;
                document.getElementById('game-message').textContent = message;
                document.getElementById('game-image').textContent = locationData.image;
                dataManager.saveGameState(state);
                loadGame(); // Refresh display to show new quest
                return;
            }
        } else if (specialEncounter.type === 'resource') {
            // Resource gathering (affected by weather)
            const resourceName = specialEncounter.name;
            const baseAmount = Math.floor(Math.random() * 3) + 1;
            const weatherAmount = applyWeatherEffects(baseAmount, 'resourceBonus', state);
            const resourceAmount = Math.max(1, weatherAmount); // Minimum 1

            state.inventory = state.inventory || [];
            const existingResource = state.inventory.find(item => item.name === resourceName);

            if (existingResource) {
                existingResource.quantity = (existingResource.quantity || 1) + resourceAmount;
            } else {
                state.inventory.push({
                    name: resourceName,
                    type: 'resource',
                    quantity: resourceAmount,
                    description: specialEncounter.description
                });
            }

            let weatherNote = '';
            if (weatherAmount !== baseAmount) {
                weatherNote = ` (${currentWeather.emoji} weather bonus!)`;
            }

            message += `🌿 You gathered ${resourceAmount}x ${resourceName}!${weatherNote} ${specialEncounter.description}`;
            dataManager.updateQuestProgress('collect_item', { item: resourceName });
        }
    }
    // Regular encounters (50% chance)
    else if (encounterChance < 0.6) {
        const encounter = selectLocationEncounter(currentLocation, state.level);

        message += `A ${encounter.rarity} ${encounter.name} appears! ${encounter.image}`;
        document.getElementById('game-message').textContent = message;
        document.getElementById('game-image').textContent = locationData.image;

        // Start turn-based battle
        startBattle(state, encounter);
        dataManager.saveGameState(state);
        return;
    }
    // Treasure/Resource finding (40% chance)
    else {
        const treasureType = Math.random();

        // Check for pet encounters first (small chance)
        const foundPet = tryFindPet(state, currentLocation);
        if (foundPet && treasureType < 0.1) { // 10% of treasure time = 4% overall chance
            state.pets = state.pets || [];
            state.pets.push(foundPet);

            message += `🐾 A wild ${foundPet.emoji} ${foundPet.name} appears!\n\n`;
            message += `${foundPet.description}\n\n`;
            message += `The ${foundPet.name} seems friendly and decides to join your adventure!\n`;
            message += `💝 New companion added to your collection!`;

            // Auto-activate if it's the first pet
            if (state.pets.length === 1) {
                state.activePet = foundPet.id;
                foundPet.isActive = true;
                message += `\n\n🌟 ${foundPet.name} is now your active companion!`;
            }
        } else if (treasureType < 0.4) {
            // Location-specific resources (affected by weather)
            if (locationData.resources.length > 0) {
                const resource = locationData.resources[Math.floor(Math.random() * locationData.resources.length)];
                const baseAmount = Math.floor(Math.random() * 2) + 1;
                const weatherAmount = applyWeatherEffects(baseAmount, 'resourceBonus', state);
                const skillAmount = applyPassiveSkills(state, 'resources', weatherAmount);
                const amount = Math.max(1, skillAmount);

                state.inventory = state.inventory || [];
                const existingResource = state.inventory.find(item => item.name === resource);

                if (existingResource) {
                    existingResource.quantity = (existingResource.quantity || 1) + amount;
                } else {
                    state.inventory.push({
                        name: resource,
                        type: 'resource',
                        quantity: amount,
                        description: `Collected from ${currentLocation}`
                    });
                }

                let weatherNote = '';
                if (weatherAmount !== baseAmount) {
                    weatherNote = ` ${currentWeather.emoji}`;
                }

                message += `🌿 You found ${amount}x ${resource}!${weatherNote}`;
                dataManager.updateQuestProgress('collect_item', { item: resource });
            } else {
                // Fallback to gold (affected by weather and skills)
                const baseGold = Math.floor(Math.random() * 50) + 20;
                const weatherGold = applyWeatherEffects(baseGold, 'treasureBonus', state);
                const skillGold = applyPassiveSkills(state, 'treasure', weatherGold);
                const goldFound = Math.max(1, skillGold);
                state.gold += goldFound;

                let weatherNote = '';
                if (weatherGold !== baseGold) {
                    weatherNote = ` ${currentWeather.emoji}`;
                }
                message += `💰 You found ${goldFound} gold coins!${weatherNote}`;
            }
        } else if (treasureType < 0.8) {
            // Equipment treasure
            const equipmentType = Math.random() < 0.5 ? 'weapons' : 'armor';
            const items = equipment[equipmentType].filter(
                item => item.rarity === 'common' || (item.rarity === 'uncommon' && state.level >= 5)
            );
            const foundEquipment = items[Math.floor(Math.random() * items.length)];

            state.inventory = state.inventory || [];
            state.inventory.push(foundEquipment);
            message += `⚔️ You found ${foundEquipment.name}! Added to inventory.`;
        } else {
            // Gold treasure (affected by weather and skills)
            const baseGold = Math.floor(Math.random() * 100) + 30;
            const weatherGold = applyWeatherEffects(baseGold, 'treasureBonus', state);
            const skillGold = applyPassiveSkills(state, 'treasure', weatherGold);
            const goldFound = Math.max(1, skillGold);
            state.gold += goldFound;

            let weatherNote = '';
            if (weatherGold !== baseGold) {
                weatherNote = ` ${currentWeather.emoji}`;
            }
            message += `💰 You discovered a treasure cache with ${goldFound} gold!${weatherNote}`;
        }
    }

    // Check for random events (small chance after normal exploration)
    const randomEvent = tryTriggerRandomEvent(state, currentLocation);
    if (randomEvent) {
        const eventResult = processRandomEvent(state, randomEvent.key, randomEvent.data);
        if (eventResult.type === 'message') {
            message += '\n\n' + eventResult.message;
        } else if (eventResult.type === 'choice') {
            // For now, auto-select a random choice (could be expanded for user input)
            const randomChoice = Math.floor(Math.random() * eventResult.choices.length);
            const choiceResult = processRandomEvent(state, randomEvent.key, randomEvent.data, randomChoice);
            if (choiceResult.type === 'message') {
                message += '\n\n' + choiceResult.message;
            }
        }
    }

    document.getElementById('game-message').textContent = message;
    document.getElementById('game-image').textContent = locationData.image;

    // Check achievements
    checkAchievements(state);

    dataManager.saveGameState(state);
    updateGameDisplay();
}

function selectLocationEncounter(location, playerLevel) {
    const locationData = gameScenarios[location];
    let validEncounters = encounters.filter(enemy => {
        return enemy.level <= playerLevel + 2 && enemy.level >= Math.max(1, playerLevel - 2);
    });

    // Filter by location if specified
    if (locationData.preferredEnemies && locationData.preferredEnemies.length > 0) {
        const preferredEncounters = validEncounters.filter(enemy => locationData.preferredEnemies.includes(enemy.name));
        if (preferredEncounters.length > 0) {
            validEncounters = preferredEncounters;
        }
    }

    const rand = Math.random();

    if (rand < 0.02 && playerLevel >= 8) {
        // 2% chance for boss (high level only)
        const bossEnemies = validEncounters.filter(e => e.rarity === 'boss');
        if (bossEnemies.length > 0) {
            return bossEnemies[Math.floor(Math.random() * bossEnemies.length)];
        }
    } else if (rand < 0.15) {
        // 13% chance for rare
        const rareEnemies = validEncounters.filter(e => e.rarity === 'rare');
        if (rareEnemies.length > 0) {
            return rareEnemies[Math.floor(Math.random() * rareEnemies.length)];
        }
    } else if (rand < 0.45) {
        // 30% chance for uncommon
        const uncommonEnemies = validEncounters.filter(e => e.rarity === 'uncommon');
        if (uncommonEnemies.length > 0) {
            return uncommonEnemies[Math.floor(Math.random() * uncommonEnemies.length)];
        }
    }

    // Default to common enemies (55% chance or fallback)
    const commonEnemies = validEncounters.filter(e => e.rarity === 'common');
    if (commonEnemies.length > 0) {
        return commonEnemies[Math.floor(Math.random() * commonEnemies.length)];
    }

    // Ultimate fallback - return any valid encounter
    return validEncounters[Math.floor(Math.random() * validEncounters.length)];
}

function selectRandomEncounter() {
    const rand = Math.random();

    if (rand < 0.02) {
        // 2% chance for boss
        return encounters.find(e => e.rarity === 'boss');
    } else if (rand < 0.1) {
        // 8% chance for rare
        const rareEnemies = encounters.filter(e => e.rarity === 'rare');
        return rareEnemies[Math.floor(Math.random() * rareEnemies.length)];
    } else if (rand < 0.4) {
        // 30% chance for uncommon
        const uncommonEnemies = encounters.filter(e => e.rarity === 'uncommon');
        return uncommonEnemies[Math.floor(Math.random() * uncommonEnemies.length)];
    } else {
        // 60% chance for common
        const commonEnemies = encounters.filter(e => e.rarity === 'common');
        return commonEnemies[Math.floor(Math.random() * commonEnemies.length)];
    }
}

function startBattle(state, enemy) {
    // Apply weather effects to enemy stats
    const currentWeather = getCurrentWeather(state);
    const weatherMod = currentWeather.effects.enemyDangerMod || 1.0;

    // Initialize battle state with weather-modified enemy
    enemy.currentHp = enemy.hp;
    enemy.maxHp = enemy.hp;
    enemy.attack = Math.floor(enemy.attack * weatherMod);
    enemy.statusEffects = {};
    enemy.weatherModified = weatherMod !== 1.0; // Track if weather affected enemy

    state.inBattle = true;
    state.currentEnemy = enemy;
    state.battleTurn = 'player';
    state.statusEffects = state.statusEffects || {};

    // Reduce skill cooldowns at battle start
    if (state.skills && state.skills.cooldowns) {
        Object.keys(state.skills.cooldowns).forEach(skillKey => {
            if (state.skills.cooldowns[skillKey] > 0) {
                state.skills.cooldowns[skillKey]--;
            }
        });
    }

    document.getElementById('game-message').textContent =
        `⚔️ BATTLE STARTED! ⚔️\n\nA ${enemy.rarity} ${enemy.name} ${enemy.image} challenges you!\n\nChoose your action wisely...`;

    updateGameDisplay();
    return true;
}

function performPlayerAction(actionType, skillKey = null) {
    const state = dataManager.getGameState();
    const enemy = state.currentEnemy;

    if (!state.inBattle || !enemy || state.battleTurn !== 'player') return;

    let battleLog = '';
    let playerDamage = 0;
    let manaCost = 0;

    switch (actionType) {
    case 'attack':
        playerDamage = calculatePlayerDamage(state, enemy, 1.0);
        battleLog = `⚔️ You attack for ${playerDamage} damage!`;
        break;

    case 'heavy_attack':
        playerDamage = calculatePlayerDamage(state, enemy, 2.0);
        battleLog = `💥 Heavy Attack! ${playerDamage} damage but you're vulnerable!`;
        enemy.heavyAttackVulnerability = true;
        break;

    case 'defend': {
        const healAmount = Math.floor(state.maxHp * 0.1);
        state.hp = Math.min(state.maxHp, state.hp + healAmount);
        state.defendingThisTurn = true;
        battleLog = `🛡️ You defend and recover ${healAmount} HP!`;
        break;
    }

    case 'skill': {
        const result = useSkill(state, enemy, skillKey);
        if (!result.success) {
            document.getElementById('game-message').textContent = result.message;
            return;
        }
        playerDamage = result.damage || 0;
        manaCost = result.manaCost || 0;
        battleLog = result.message;

        // Track skill usage for quests
        dataManager.updateQuestProgress('use_skill', { skill: skillKey });
        break;
    }
    }

    // Apply damage to enemy
    if (playerDamage > 0) {
        enemy.currentHp = Math.max(0, enemy.currentHp - playerDamage);
    }

    // Deduct mana
    if (manaCost > 0) {
        state.mana = Math.max(0, state.mana - manaCost);
    }

    // Check if enemy is defeated
    if (enemy.currentHp <= 0) {
        endBattle(state, true, battleLog);
        return;
    }

    // Enemy turn
    state.battleTurn = 'enemy';
    setTimeout(() => performEnemyAction(state, enemy, battleLog), 1500);
}

function performEnemyAction(state, enemy, previousLog) {
    if (!state.inBattle || state.battleTurn !== 'enemy') return;

    let enemyDamage = calculateEnemyDamage(state, enemy);
    let battleLog = previousLog + '\n\n';

    // Check if player is defending
    if (state.defendingThisTurn) {
        enemyDamage = Math.floor(enemyDamage * 0.25);
        battleLog += `🛡️ Your defense reduces damage to ${enemyDamage}!`;
        state.defendingThisTurn = false;
    } else if (enemy.heavyAttackVulnerability) {
        enemyDamage = Math.floor(enemyDamage * 1.5);
        battleLog += `💥 ${enemy.name} exploits your vulnerability! ${enemyDamage} damage!`;
        enemy.heavyAttackVulnerability = false;
    } else {
        battleLog += `${enemy.image} ${enemy.name} attacks for ${enemyDamage} damage!`;
    }

    // Apply damage to player
    state.hp = Math.max(0, state.hp - enemyDamage);

    // Check if player is defeated
    if (state.hp <= 0) {
        endBattle(state, false, battleLog);
        return;
    }

    // Apply status effects and regeneration
    processStatusEffects(state, enemy);

    // Regenerate some mana
    state.mana = Math.min(state.maxMana, state.mana + 5);

    // Back to player turn
    state.battleTurn = 'player';

    document.getElementById('game-message').textContent = battleLog + '\n\n🎯 Your turn! Choose your action:';
    updateGameDisplay();
}

function calculatePlayerDamage(state, enemy, multiplier = 1.0) {
    const baseAttack = (state.attack || 15) + (state.equipment?.weapon?.attack || 0);
    let damage = Math.floor(Math.random() * baseAttack) + Math.floor(baseAttack * 0.5);

    // Apply multiplier
    damage = Math.floor(damage * multiplier);

    // Critical hit check
    const critChance = state.critChance || 10;
    if (Math.random() * 100 < critChance) {
        damage *= 2;
        // Add crit indicator to last message
    }

    return Math.max(1, damage);
}

function calculateEnemyDamage(state, enemy) {
    let damage = Math.floor(Math.random() * enemy.attack) + Math.floor(enemy.attack * 0.3);

    // Player dodge check
    const dodgeChance = state.dodgeChance || 5;
    if (Math.random() * 100 < dodgeChance) {
        return 0; // Complete dodge
    }

    // Apply player defense
    const playerDefense = (state.defense || 5) + (state.equipment?.armor?.defense || 0);
    damage = Math.max(1, damage - playerDefense);

    return damage;
}

function useSkill(state, enemy, skillKey) {
    const skill = skills[skillKey];
    const cooldown = state.skills?.cooldowns?.[skillKey] || 0;

    if (!skill) {
        return { success: false, message: '❌ Skill not found!' };
    }

    if (cooldown > 0) {
        return { success: false, message: `⏳ Skill on cooldown for ${cooldown} more turns!` };
    }

    if (state.mana < skill.manaCost) {
        return { success: false, message: `🔮 Not enough mana! Need ${skill.manaCost}, have ${state.mana}.` };
    }

    // Set cooldown
    state.skills.cooldowns = state.skills.cooldowns || {};
    state.skills.cooldowns[skillKey] = skill.cooldown;

    // Apply skill effect
    return applySkillEffect(state, enemy, skill);
}

function applySkillEffect(state, enemy, skill) {
    let damage = 0;
    let message = `✨ ${skill.name}! `;

    switch (skill.effect) {
    case 'magic_damage':
        damage = Math.floor((state.attack || 15) * 1.5);
        message += `${damage} magic damage (ignores armor)!`;
        break;

    case 'heal_self': {
        const healAmount = Math.floor(state.maxHp * 0.4);
        state.hp = Math.min(state.maxHp, state.hp + healAmount);
        message += `Restored ${healAmount} HP!`;
        break;
    }

    case 'guaranteed_crit':
        damage = calculatePlayerDamage(state, enemy, 1.0) * 2;
        message += `Critical hit for ${damage} damage!`;
        break;

    case 'backstab_attack':
        damage = calculatePlayerDamage(state, enemy, 1.8) * 2;
        message += `Backstab critical for ${damage} damage!`;
        break;

    case 'ultimate_attack':
        damage = calculatePlayerDamage(state, enemy, 3.0);
        message += `ULTIMATE ATTACK! ${damage} devastating damage!`;
        break;

    default:
        damage = calculatePlayerDamage(state, enemy, 1.2);
        message += `${damage} enhanced damage!`;
    }

    return {
        success: true,
        damage: damage,
        manaCost: skill.manaCost,
        message: message
    };
}

function processStatusEffects() {
    // Process any status effects here (poison, buffs, etc.)
}

function endBattle(state, victory, battleLog) {
    const enemy = state.currentEnemy;
    let finalMessage = battleLog + '\n\n';

    if (victory) {
        // Victory rewards (with weather, pet, and skill effects)
        const currentWeather = getCurrentWeather(state);
        const weatherXp = applyWeatherEffects(enemy.xp, 'xpBonus', state);
        const petXp = applyPetBonuses(state, 'xp', weatherXp);
        const skillXp = applyPassiveSkills(state, 'xp', petXp);
        const xpGained = Math.max(1, skillXp);

        state.xp += xpGained;
        state.gold += enemy.gold;

        finalMessage += `🎉 VICTORY! 🎉\n`;
        finalMessage += `💀 Defeated ${enemy.name}!\n`;

        let xpNote = '';
        if (weatherXp !== enemy.xp) {
            xpNote = ` ${currentWeather.emoji}`;
        }
        finalMessage += `✨ +${xpGained} XP${xpNote}\n`;
        finalMessage += `💰 +${enemy.gold} Gold\n`;

        // Weather effect notification
        if (enemy.weatherModified) {
            if (currentWeather.effects.enemyDangerMod > 1.0) {
                finalMessage += `${currentWeather.emoji} The ${currentWeather.name.toLowerCase()} made enemies stronger!\n`;
            } else if (currentWeather.effects.enemyDangerMod < 1.0) {
                finalMessage += `${currentWeather.emoji} The ${currentWeather.name.toLowerCase()} weakened your enemy!\n`;
            }
        }

        // Update quest progress for kill
        dataManager.updateQuestProgress('kill', { enemy: enemy.name });

        // Check for loot drops
        if (Math.random() < 0.3 && enemy.loot && enemy.loot.length > 0) {
            const loot = enemy.loot[Math.floor(Math.random() * enemy.loot.length)];
            state.inventory = state.inventory || [];
            state.inventory.push(loot);
            finalMessage += `🎁 Found: ${loot}!\n`;
        }

        // Boss victory bonus
        if (enemy.rarity === 'boss') {
            state.bossesDefeated = (state.bossesDefeated || 0) + 1;
            finalMessage += `\n👑 EPIC BOSS DEFEATED!\n`;

            // Update quest progress for boss defeat
            dataManager.updateQuestProgress('defeat_boss', { boss: enemy.name });
        }

        // Level up check
        const leveledUp = checkLevelUp(state);
        if (leveledUp) {
            finalMessage += `\n🎉 LEVEL UP! Now level ${state.level}!\n`;
            finalMessage += `❤️ HP restored! Stats increased!\n`;

            // Check if new locations are unlocked
            checkLocationUnlocks(state);
        }
    } else {
        finalMessage += `💀 DEFEAT! 💀\n`;
        finalMessage += `You were defeated by ${enemy.name}!\n`;
        finalMessage += `Click 'New Game' to try again.\n`;
    }

    // Apply pet post-battle effects
    if (victory) {
        const petEffects = petPostBattleEffects(state);
        if (petEffects) {
            finalMessage += `\n${petEffects}`;
        }
    }

    // Clean up battle state
    state.inBattle = false;
    state.currentEnemy = null;
    state.battleTurn = 'player';
    state.statusEffects = {};

    document.getElementById('game-message').textContent = finalMessage;
    document.getElementById('game-image').textContent = victory ? '🎉' : '💀';

    checkAchievements(state);
    dataManager.saveGameState(state);
    updateGameDisplay();
    updateQuestDisplay(); // Refresh quest display after battle
}

function checkLocationUnlocks(state) {
    for (const locationId in gameScenarios) {
        const location = gameScenarios[locationId];

        if (!state.unlockedLocations.includes(locationId)) {
            let canUnlock = true;

            // Check level requirement
            if (location.levelRequirement && state.level < location.levelRequirement) {
                canUnlock = false;
            }

            // Check unlock conditions
            if (location.unlockCondition) {
                const condition = location.unlockCondition;

                if (condition.level && state.level < condition.level) {
                    canUnlock = false;
                }

                if (condition.bossesDefeated && state.bossesDefeated < condition.bossesDefeated) {
                    canUnlock = false;
                }

                if (condition.questCompleted && !state.completedQuests.includes(condition.questCompleted)) {
                    canUnlock = false;
                }
            }

            if (canUnlock) {
                state.unlockedLocations.push(locationId);
                showMessage(
                    `New location unlocked: ${locationId.charAt(0).toUpperCase() + locationId.slice(1)}!`,
                    'success'
                );
            }
        }
    }
}

function checkSkillUnlocks(state) {
    state.skills = state.skills || { available: [], cooldowns: {} };
    const newSkills = [];

    // Check all skills for unlock conditions
    for (const [skillKey, skill] of Object.entries(skills)) {
        // Skip if already unlocked
        if (state.skills.available.includes(skillKey)) continue;

        let canUnlock = false;

        // Check level requirements
        if (skill.unlockLevel && state.level >= skill.unlockLevel) {
            canUnlock = true;
        }

        // Check class-specific skills
        const classData = characterClasses[state.class];
        if (classData && classData.skills.includes(skillKey)) {
            canUnlock = true;
        }

        // Special unlock conditions could be added here
        // e.g., quest completion, boss defeats, etc.

        if (canUnlock) {
            state.skills.available.push(skillKey);
            newSkills.push(skill);
        }
    }

    // Show notifications for new skills
    if (newSkills.length > 0) {
        let message = '🌟 NEW SKILLS UNLOCKED! 🌟\n\n';
        newSkills.forEach(skill => {
            message += `✨ ${skill.name}\n`;
            message += `   ${skill.description}\n\n`;
        });

        // Store message to show after level up notification
        state.newSkillsMessage = message;
    }
}

function applyPassiveSkills(state, bonusType, baseValue) {
    if (!state.skills || !state.skills.available) return baseValue;

    let multiplier = 1.0;
    let flatBonus = 0;

    state.skills.available.forEach(skillKey => {
        const skill = skills[skillKey];
        if (!skill || skill.type !== 'passive') return;

        switch (skill.effect) {
        case 'passive_crit_boost':
            if (bonusType === 'crit_chance') flatBonus += 15;
            break;
        case 'passive_damage_reduction':
            if (bonusType === 'damage_taken') multiplier *= 0.8; // 20% reduction
            break;
        case 'passive_treasure_bonus':
            if (bonusType === 'treasure') multiplier += 0.3;
            break;
        case 'passive_resource_bonus':
            if (bonusType === 'resources') multiplier += 0.25;
            break;
        case 'passive_xp_bonus':
            if (bonusType === 'xp') multiplier += 0.4;
            break;
        case 'passive_mana_reduction':
            if (bonusType === 'mana_cost') multiplier *= 0.75; // 25% reduction
            break;
        }
    });

    return Math.floor(baseValue * multiplier) + flatBonus;
}

function getPassiveSkillBonuses(state) {
    if (!state.skills || !state.skills.available) return {};

    const bonuses = {
        critChance: 0,
        damageReduction: 0,
        treasureBonus: 0,
        resourceBonus: 0,
        xpBonus: 0,
        manaCostReduction: 0,
        dodgeBonus: 0
    };

    state.skills.available.forEach(skillKey => {
        const skill = skills[skillKey];
        if (!skill || skill.type !== 'passive') return;

        switch (skill.effect) {
        case 'passive_crit_boost':
            bonuses.critChance += 15;
            break;
        case 'passive_damage_reduction':
            bonuses.damageReduction += 20;
            break;
        case 'passive_treasure_bonus':
            bonuses.treasureBonus += 30;
            break;
        case 'passive_resource_bonus':
            bonuses.resourceBonus += 25;
            break;
        case 'passive_xp_bonus':
            bonuses.xpBonus += 40;
            break;
        case 'passive_mana_reduction':
            bonuses.manaCostReduction += 25;
            break;
        case 'passive_reflexes':
            bonuses.dodgeBonus += 20;
            break;
        }
    });

    return bonuses;
}

function checkLevelUp(state) {
    let leveledUp = false;

    while (state.xp >= state.xpNeeded) {
        state.level++;
        state.xp -= state.xpNeeded;
        state.xpNeeded = Math.floor(state.xpNeeded * 1.5);

        // Level up bonuses
        state.maxHp += 25;
        state.hp = state.maxHp;
        state.attack += 2;
        state.defense += 1;
        state.critChance += 1;

        // Check for new skill unlocks
        checkSkillUnlocks(state);

        leveledUp = true;
    }

    return leveledUp;
}

function checkAchievements(state) {
    const unlockedAchievements = state.achievements || [];

    achievements.forEach(achievement => {
        if (unlockedAchievements.includes(achievement.id)) return;

        let unlocked = false;

        switch (achievement.id) {
        case 'first_kill':
            unlocked = state.explorationCount >= 1;
            break;
        case 'explorer':
            unlocked = state.explorationCount >= 10;
            break;
        case 'treasure_hunter':
            unlocked = state.gold >= 500;
            break;
        case 'level_master':
            unlocked = state.level >= 10;
            break;
        case 'dragon_slayer':
            unlocked = state.bossesDefeated >= 1;
            break;
        case 'boss_hunter':
            unlocked = state.bossesDefeated >= 5;
            break;
        }

        if (unlocked) {
            unlockedAchievements.push(achievement.id);
            state.gold += achievement.reward;

            setTimeout(() => {
                alert(
                    `🏆 Achievement Unlocked!\n${achievement.name}\n${achievement.description}\n+${achievement.reward} Gold Reward!`
                );
            }, 100);
        }
    });

    state.achievements = unlockedAchievements;
}

function rest() {
    const state = dataManager.getGameState();

    if (state.hp === state.maxHp) {
        document.getElementById('game-message').textContent = 'You are already at full health!';
        return;
    }

    const healAmount = Math.floor(state.maxHp * 0.5);
    state.hp = Math.min(state.maxHp, state.hp + healAmount);

    document.getElementById('game-message').textContent = `You rest at a campfire. 🔥\n\n+${healAmount} HP restored!`;
    document.getElementById('game-image').textContent = '😴';

    dataManager.saveGameState(state);
    updateGameDisplay();
}

function shop() {
    const state = dataManager.getGameState();

    let shopMessage = '🏪 ⚔️ ADVENTURE SHOP ⚔️ 🏪\n\n';
    shopMessage += `Your Gold: ${state.gold} 💰\n\n`;
    shopMessage += '=== CONSUMABLES ===\n';
    shopMessage += '1. Health Potion - 50 Gold (Restore 50 HP)\n';
    shopMessage += '2. Max HP Upgrade - 200 Gold (+30 Max HP)\n\n';

    shopMessage += '=== WEAPONS ===\n';
    const availableWeapons = equipment.weapons.filter(w => w.cost <= state.gold * 2);
    availableWeapons.slice(0, 3).forEach((weapon, index) => {
        shopMessage += `${index + 3}. ${weapon.name} - ${weapon.cost} Gold (+${weapon.attack} Attack)\n`;
    });

    shopMessage += '\n=== ARMOR ===\n';
    const availableArmor = equipment.armor.filter(a => a.cost <= state.gold * 2);
    availableArmor.slice(0, 3).forEach((armor, index) => {
        shopMessage += `${index + 6}. ${armor.name} - ${armor.cost} Gold (+${armor.defense} Defense)\n`;
    });

    shopMessage += '\nEnter number to buy, \'i\' for inventory, or any other key to leave.';

    const choice = prompt(shopMessage);

    if (choice === '1' && state.gold >= 50) {
        state.gold -= 50;
        state.hp = Math.min(state.maxHp, state.hp + 50);
        document.getElementById('game-message').textContent = '🧪 You bought a Health Potion! +50 HP restored!';
    } else if (choice === '2' && state.gold >= 200) {
        state.gold -= 200;
        state.maxHp += 30;
        state.hp += 30;
        document.getElementById('game-message').textContent = '💪 You bought a Max HP Upgrade! +30 Max HP permanently!';
    } else if (choice >= '3' && choice <= '5') {
        const weaponIndex = parseInt(choice) - 3;
        if (weaponIndex < availableWeapons.length) {
            const weapon = availableWeapons[weaponIndex];
            if (state.gold >= weapon.cost) {
                state.gold -= weapon.cost;

                // Replace current weapon
                const oldWeapon = state.equipment?.weapon?.name || 'None';
                state.equipment = state.equipment || {};
                state.equipment.weapon = weapon;
                state.attack = 15 + weapon.attack; // Base attack + weapon bonus

                document.getElementById('game-message').textContent =
                    `⚔️ You bought ${weapon.name}! Replaced ${oldWeapon}.\n+${weapon.attack} Attack Power!`;
            } else {
                document.getElementById('game-message').textContent = '💸 Not enough gold for that weapon!';
            }
        }
    } else if (choice >= '6' && choice <= '8') {
        const armorIndex = parseInt(choice) - 6;
        if (armorIndex < availableArmor.length) {
            const armor = availableArmor[armorIndex];
            if (state.gold >= armor.cost) {
                state.gold -= armor.cost;

                // Replace current armor
                const oldArmor = state.equipment?.armor?.name || 'None';
                state.equipment = state.equipment || {};
                state.equipment.armor = armor;
                state.defense = 5 + armor.defense; // Base defense + armor bonus

                document.getElementById('game-message').textContent =
                    `🛡️ You bought ${armor.name}! Replaced ${oldArmor}.\n+${armor.defense} Defense Power!`;
            } else {
                document.getElementById('game-message').textContent = '💸 Not enough gold for that armor!';
            }
        }
    } else if (choice.toLowerCase() === 'i') {
        showInventory(state);
        return; // Don't update display yet
    } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(choice)) {
        document.getElementById('game-message').textContent = '💸 Not enough gold for that item!';
    } else {
        document.getElementById('game-message').textContent = '👋 Thanks for visiting the shop! Come back anytime!';
    }

    document.getElementById('game-image').textContent = '🏪';

    dataManager.saveGameState(state);
    updateGameDisplay();
}

function showInventory(state) {
    const inventory = state.inventory || [];

    if (inventory.length === 0) {
        document.getElementById('game-message').textContent =
            '🎒 Your inventory is empty! Find items while exploring or buy them from the shop.';
        document.getElementById('game-image').textContent = '🎒';
        return;
    }

    let inventoryMessage = '🎒 === YOUR INVENTORY === 🎒\n\n';
    inventory.forEach((item, index) => {
        if (typeof item === 'string') {
            inventoryMessage += `${index + 1}. ${item}\n`;
        } else {
            inventoryMessage += `${index + 1}. ${item.name} (${item.rarity})\n`;
        }
    });

    inventoryMessage += '\nYour inventory contains items you\'ve found during your adventures!';

    document.getElementById('game-message').textContent = inventoryMessage;
    document.getElementById('game-image').textContent = '🎒';
}

function chooseClass() {
    let classMessage = '🎭 === CHOOSE YOUR CLASS === 🎭\n\n';

    Object.keys(characterClasses).forEach((classKey, index) => {
        const classData = characterClasses[classKey];
        classMessage += `${index + 1}. ${classData.name}\n`;
        classMessage += `   ${classData.description}\n\n`;
    });

    classMessage += 'Enter 1-4 to choose your class:';

    const choice = prompt(classMessage);
    const classKeys = Object.keys(characterClasses);
    const selectedIndex = parseInt(choice) - 1;

    if (selectedIndex >= 0 && selectedIndex < classKeys.length) {
        const selectedClass = classKeys[selectedIndex];
        const state = dataManager.getGameState();

        // Apply class bonuses
        const classData = characterClasses[selectedClass];
        state.class = selectedClass;
        state.maxHp += classData.bonuses.hp || 0;
        state.hp = state.maxHp;
        state.attack += classData.bonuses.attack || 0;
        state.defense += classData.bonuses.defense || 0;
        state.critChance += classData.bonuses.critChance || 0;
        state.dodgeChance += classData.bonuses.dodgeChance || 0;
        state.maxMana += classData.bonuses.mana || 0;
        state.mana = state.maxMana;

        // Unlock starting skills
        state.skills.available = [...classData.skills];

        dataManager.saveGameState(state);
        updateGameDisplay();

        document.getElementById('game-message').textContent =
            `Class selected: ${classData.name}!\n\nYou've unlocked your class skills and gained stat bonuses. Your adventure begins now!`;
        document.getElementById('game-image').textContent = classData.name.split(' ')[0];

        return true;
    } else {
        document.getElementById('game-message').textContent =
            'Invalid choice! Please restart and choose a valid class (1-4).';
        return false;
    }
}

function showStats() {
    const state = dataManager.getGameState();
    const classData = characterClasses[state.class] || characterClasses.warrior;

    let statsMessage = '📊 === CHARACTER STATS === 📊\n\n';
    statsMessage += `🦸 Name: ${state.name}\n`;
    statsMessage += `🎭 Class: ${classData.name}\n`;
    statsMessage += `⭐ Level: ${state.level}\n`;
    statsMessage += `✨ XP: ${state.xp}/${state.xpNeeded}\n`;
    statsMessage += `❤️ HP: ${state.hp}/${state.maxHp}\n`;
    statsMessage += `� Mana: ${state.mana || 50}/${state.maxMana || 50}\n`;
    statsMessage += `�💰 Gold: ${state.gold}\n\n`;

    statsMessage += '=== COMBAT STATS ===\n';
    statsMessage += `⚔️ Attack: ${state.attack || 15}\n`;
    statsMessage += `🛡️ Defense: ${state.defense || 5}\n`;
    statsMessage += `💥 Crit Chance: ${state.critChance || 10}%\n`;
    statsMessage += `💨 Dodge Chance: ${state.dodgeChance || 5}%\n\n`;

    statsMessage += '=== EQUIPMENT ===\n';
    statsMessage += `⚔️ Weapon: ${state.equipment?.weapon?.name || 'Iron Sword'}\n`;
    statsMessage += `🛡️ Armor: ${state.equipment?.armor?.name || 'Leather Armor'}\n\n`;

    statsMessage += '=== SKILLS ===\n';
    const availableSkills = state.skills?.available || [];
    if (availableSkills.length > 0) {
        availableSkills.forEach(skillKey => {
            const skill = skills[skillKey];
            if (skill) {
                const cooldown = state.skills?.cooldowns?.[skillKey] || 0;
                const status = cooldown > 0 ? `(${cooldown} turns)` : '✅';
                statsMessage += `${skill.name} ${status}\n`;
            }
        });
    } else {
        statsMessage += 'No skills unlocked yet.\n';
    }

    statsMessage += '\n=== ACHIEVEMENTS ===\n';
    const unlockedCount = (state.achievements || []).length;
    statsMessage += `🏆 Unlocked: ${unlockedCount}/${achievements.length}\n`;
    statsMessage += `🗺️ Explorations: ${state.explorationCount || 0}\n`;
    statsMessage += `👑 Bosses Defeated: ${state.bossesDefeated || 0}\n`;

    if (unlockedCount > 0) {
        statsMessage += '\n=== UNLOCKED ACHIEVEMENTS ===\n';
        (state.achievements || []).forEach(achievementId => {
            const achievement = achievements.find(a => a.id === achievementId);
            if (achievement) {
                statsMessage += `🏆 ${achievement.name}\n`;
            }
        });
    }

    document.getElementById('game-message').textContent = statsMessage;
    document.getElementById('game-image').textContent = '📊';
}

function showPets() {
    const state = dataManager.getGameState();
    const pets = state.pets || [];

    let petsMessage = '🐾 === PET COMPANIONS === 🐾\n\n';

    if (pets.length === 0) {
        petsMessage += 'No companions yet! Explore different locations to find pets.\n\n';
        petsMessage += '🔍 Pet Finding Tips:\n';
        petsMessage += '• Wolf Pups can be found in Forests and Mountains\n';
        petsMessage += '• Crystal Sprites dwell in Caves and Ruins\n';
        petsMessage += '• Shadow Cats lurk in Swamps and Ruins\n';
        petsMessage += '• Fire Salamanders live in Deserts and Mountains\n';
        petsMessage += '• Ancient Turtles are extremely rare in Ruins\n\n';
        petsMessage += 'Higher level = better chances of finding rare pets!';
    } else {
        const activePet = pets.find(p => p.id === state.activePet);
        if (activePet) {
            petsMessage += `🌟 ACTIVE COMPANION: ${activePet.emoji} ${activePet.name}\n`;
            petsMessage += `Level ${activePet.level} • ❤️ ${activePet.loyalty}/${activePet.maxLoyalty} Loyalty\n`;
            petsMessage += `⚔️ ${activePet.attack} ATK • 🛡️ ${activePet.defense} DEF • ❤️ ${activePet.health}/${activePet.maxHealth} HP\n\n`;

            petsMessage += `📋 Abilities:\n`;
            activePet.abilities.forEach(abilityKey => {
                const ability = petAbilities[abilityKey];
                if (ability) {
                    petsMessage += `• ${ability.name}: ${ability.description}\n`;
                }
            });
            petsMessage += '\n';
        }

        petsMessage += `🏠 ALL COMPANIONS (${pets.length}):\n`;
        pets.forEach((pet, index) => {
            const isActive = pet.id === state.activePet;
            const status = isActive ? ' ⭐ ACTIVE' : '';
            petsMessage += `${index + 1}. ${pet.emoji} ${pet.name} (Lv.${pet.level})${status}\n`;
            petsMessage += `   ${pet.description}\n`;
            petsMessage += `   Loyalty: ${pet.loyalty}/${pet.maxLoyalty} • Rarity: ${pet.rarity}\n\n`;
        });

        petsMessage += '💡 Visit locations where your pets were found to increase their loyalty!\n';
        petsMessage += '🎯 Pets gain XP from battles and level up to become stronger!';
    }

    document.getElementById('game-message').textContent = petsMessage;
    document.getElementById('game-image').textContent = '🐾';
}

function showCrafting() {
    const state = dataManager.getGameState();
    const inventory = state.inventory || [];

    let craftingMessage = '🔨 === CRAFTING WORKSHOP === 🔨\n\n';

    const availableRecipes = getAvailableRecipes(state);

    if (availableRecipes.length === 0) {
        craftingMessage += 'No recipes available at your current level.\n';
        craftingMessage += 'Keep exploring and leveling up to unlock crafting recipes!';
    } else {
        craftingMessage += `📜 AVAILABLE RECIPES (${availableRecipes.length}):\n\n`;

        availableRecipes.forEach(([recipeKey, recipe], index) => {
            const { canCraft, reason } = canCraftItem(state, recipeKey);
            const status = canCraft ? '✅ Ready' : '❌ Missing materials';

            craftingMessage += `${index + 1}. ${recipe.name} (${recipe.rarity})\n`;
            craftingMessage += `   ${recipe.description}\n`;
            craftingMessage += `   Level Required: ${recipe.requiredLevel} | Status: ${status}\n`;

            // Show materials needed
            craftingMessage += `   Materials needed:\n`;
            for (const [materialName, needed] of Object.entries(recipe.materials)) {
                const owned = inventory.find(item => item.name === materialName)?.quantity || 0;
                const statusSymbol = owned >= needed ? '✅' : '❌';
                craftingMessage += `     ${statusSymbol} ${materialName}: ${owned}/${needed}\n`;
            }

            // Show item stats
            if (recipe.attack) craftingMessage += `     ⚔️ Attack: ${recipe.attack}\n`;
            if (recipe.defense) craftingMessage += `     🛡️ Defense: ${recipe.defense}\n`;
            if (recipe.manaBonus) craftingMessage += `     🔮 Mana Bonus: +${recipe.manaBonus}\n`;
            if (recipe.hpBonus) craftingMessage += `     ❤️ HP Bonus: +${recipe.hpBonus}\n`;
            if (recipe.value) craftingMessage += `     💫 Effect: ${recipe.value}\n`;

            if (!canCraft && reason !== 'All materials available') {
                craftingMessage += `     📝 ${reason}\n`;
            }

            craftingMessage += '\n';
        });

        craftingMessage += '💡 Tip: Gather materials by exploring different locations!\n';
        craftingMessage += '🔍 Each location offers unique resources for crafting.';
    }

    // Show current materials
    const materials = inventory.filter(item => item.type === 'resource');
    if (materials.length > 0) {
        craftingMessage += '\n\n🎒 YOUR MATERIALS:\n';
        materials.forEach(material => {
            craftingMessage += `• ${material.name}: ${material.quantity || 1}\n`;
        });
    }

    document.getElementById('game-message').textContent = craftingMessage;
    document.getElementById('game-image').textContent = '🔨';
}

function resetGame() {
    if (confirm('Are you sure you want to start a new game? All progress will be lost.')) {
        dataManager.resetGame();
        document.getElementById('game-message').textContent = 'New adventure started! Good luck, brave hero!';
        document.getElementById('game-image').textContent = '🏰';
        updateGameDisplay();
    }
}

// Admin Section
function loadAdmin() {
    // Load bio editor
    document.getElementById('bio-editor').value = dataManager.getBio();

    // Load interests editor
    loadInterestsEditor();
}

function loadInterestsEditor() {
    const interestsEditor = document.getElementById('interests-editor');
    const interests = dataManager.getInterests();

    interestsEditor.innerHTML = interests
        .map(
            (interest, index) => `
        <div class="interest-tag-editable">
            <span>${escapeHtml(interest)}</span>
            <button onclick="removeInterest(${index})">×</button>
        </div>
    `
        )
        .join('');
}

function saveBio() {
    const bio = document.getElementById('bio-editor').value;
    if (bio.trim()) {
        dataManager.setBio(bio);
        loadHome();
        showMessage('Bio saved successfully!', 'success');
    } else {
        showMessage('Bio cannot be empty!', 'error');
    }
}

function addInterest() {
    const input = document.getElementById('new-interest');
    const interest = input.value.trim();

    if (interest) {
        const interests = dataManager.getInterests();
        interests.push(interest);
        dataManager.setInterests(interests);
        input.value = '';
        loadInterestsEditor();
        loadHome();
        showMessage('Interest added successfully!', 'success');
    } else {
        showMessage('Please enter an interest!', 'error');
    }
}

function removeInterest(index) {
    const interests = dataManager.getInterests();
    interests.splice(index, 1);
    dataManager.setInterests(interests);
    loadInterestsEditor();
    loadHome();
    showMessage('Interest removed successfully!', 'success');
}

function addPicture() {
    const url = document.getElementById('picture-url').value.trim();
    const caption = document.getElementById('picture-caption').value.trim();

    if (url && caption) {
        dataManager.addPicture({ url, caption });
        document.getElementById('picture-url').value = '';
        document.getElementById('picture-caption').value = '';
        loadGallery();
        showMessage('Picture added successfully!', 'success');
    } else {
        showMessage('Please fill in both URL and caption!', 'error');
    }
}

function addStory() {
    const title = document.getElementById('story-title').value.trim();
    const content = document.getElementById('story-content').value.trim();

    if (title && content) {
        dataManager.addStory({ title, content });
        document.getElementById('story-title').value = '';
        document.getElementById('story-content').value = '';
        loadStories();
        showMessage('Story added successfully!', 'success');
    } else {
        showMessage('Please fill in both title and content!', 'error');
    }
}

function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    const activeSection = document.querySelector('.section.active');
    activeSection.insertBefore(message, activeSection.firstChild);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Event Listeners
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('login-password').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        login();
    }
});
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('change-password-btn').addEventListener('click', changePassword);
document.getElementById('save-bio-btn').addEventListener('click', saveBio);
document.getElementById('add-interest-btn').addEventListener('click', addInterest);
document.getElementById('add-picture-btn').addEventListener('click', addPicture);
document.getElementById('add-story-btn').addEventListener('click', addStory);
document.getElementById('explore-btn').addEventListener('click', explore);
document.getElementById('rest-btn').addEventListener('click', rest);
document.getElementById('shop-btn').addEventListener('click', shop);
document.getElementById('inventory-btn').addEventListener('click', () => {
    const state = dataManager.getGameState();
    showInventory(state);
});
document.getElementById('stats-btn').addEventListener('click', showStats);
document.getElementById('pets-btn').addEventListener('click', showPets);
document.getElementById('crafting-btn').addEventListener('click', showCrafting);
document.getElementById('choose-class-btn').addEventListener('click', chooseClass);
document.getElementById('quests-btn').addEventListener('click', showQuestDetails);
document.getElementById('reset-game-btn').addEventListener('click', resetGame);
document.getElementById('skills-btn-main').addEventListener('click', showSkillsOutsideBattle);

// Battle action event listeners
document.getElementById('attack-btn').addEventListener('click', () => {
    performPlayerAction('attack');
});
document.getElementById('heavy-attack-btn').addEventListener('click', () => {
    performPlayerAction('heavy_attack');
});
document.getElementById('defend-btn').addEventListener('click', () => {
    performPlayerAction('defend');
});
document.getElementById('skills-btn').addEventListener('click', () => {
    showSkillMenu();
});

function showSkillsOutsideBattle() {
    const state = dataManager.getGameState();
    const availableSkills = state.skills?.available || [];

    if (availableSkills.length === 0) {
        showMessage('✨ No skills learned yet! Level up and choose a class to learn skills.', 'info');
        return;
    }

    let message = '✨ YOUR SKILLS ✨\n\n';

    // Show passive skills
    message += '🔮 PASSIVE ABILITIES:\n';
    availableSkills.forEach(skillKey => {
        const skill = skills[skillKey];
        if (skill.type === 'passive') {
            message += `• ${skill.name}: ${skill.description}\n`;
        }
    });

    message += '\n⚔️ ACTIVE SKILLS:\n';
    availableSkills.forEach(skillKey => {
        const skill = skills[skillKey];
        if (skill.type === 'active') {
            const cooldown = state.skills?.cooldowns?.[skillKey] || 0;
            const status = cooldown > 0 ? ` (Cooldown: ${cooldown} turns)` : ' (Ready)';
            message += `• ${skill.name}${status}: ${skill.description}\n`;
            message += `  Mana Cost: ${skill.manaCost} | Cooldown: ${skill.cooldown} turns\n`;
        }
    });

    // Show passive bonuses
    const bonuses = getPassiveSkillBonuses(state);
    if (Object.values(bonuses).some(val => val > 0)) {
        message += '\n🌟 CURRENT BONUSES:\n';
        if (bonuses.critChance > 0) message += `• +${bonuses.critChance}% Critical Hit Chance\n`;
        if (bonuses.damageReduction > 0) message += `• +${bonuses.damageReduction}% Damage Reduction\n`;
        if (bonuses.treasureBonus > 0) message += `• +${bonuses.treasureBonus}% Treasure Value\n`;
        if (bonuses.resourceBonus > 0) message += `• +${bonuses.resourceBonus}% Resource Collection\n`;
        if (bonuses.xpBonus > 0) message += `• +${bonuses.xpBonus}% Experience Gain\n`;
        if (bonuses.manaCostReduction > 0) message += `• -${bonuses.manaCostReduction}% Mana Costs\n`;
        if (bonuses.dodgeBonus > 0) message += `• +${bonuses.dodgeBonus}% Dodge Chance\n`;
    }

    showMessage(message, 'info');
}

function showSkillMenu() {
    const state = dataManager.getGameState();
    const availableSkills = state.skills?.available || [];

    if (availableSkills.length === 0) {
        document.getElementById('game-message').textContent += '\n\n❌ No skills available!';
        return;
    }

    let skillMessage = '✨ === CHOOSE SKILL === ✨\n\n';

    availableSkills.forEach((skillKey, index) => {
        const skill = skills[skillKey];
        const cooldown = state.skills?.cooldowns?.[skillKey] || 0;
        const status =
            cooldown > 0 ? `(${cooldown} turns)` : state.mana < skill.manaCost ? `(${skill.manaCost} mana)` : '✅';

        skillMessage += `${index + 1}. ${skill.name} ${status}\n`;
        skillMessage += `   ${skill.description}\n`;
        skillMessage += `   Mana: ${skill.manaCost} | Cooldown: ${skill.cooldown}\n\n`;
    });

    skillMessage += 'Enter 1-' + availableSkills.length + ' to use skill, or any other key to cancel:';

    /* eslint-disable no-alert */
    const choice = prompt(skillMessage);
    /* eslint-enable no-alert */
    const skillIndex = parseInt(choice) - 1;

    if (skillIndex >= 0 && skillIndex < availableSkills.length) {
        const skillKey = availableSkills[skillIndex];
        performPlayerAction('skill', skillKey);
    }
}

// PWA Service Worker Registration
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration.scope);

            // Listen for service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // Show update available notification
                            showUpdateNotification();
                        }
                    }
                });
            });
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>🎮 New version available! Refresh to update.</span>
            <button onclick="location.reload()" class="update-btn">Update Now</button>
            <button onclick="this.parentElement.parentElement.remove()" class="dismiss-btn">×</button>
        </div>
    `;
    document.body.appendChild(notification);
}

// PWA Install Prompt
let deferredPrompt;
function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        hideInstallButton();
    });
}

function showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.className = 'install-btn';
    installBtn.innerHTML = '📱 Install App';
    installBtn.onclick = installPWA;

    const navbar = document.querySelector('.navbar');
    if (navbar && !document.getElementById('install-btn')) {
        navbar.appendChild(installBtn);
    }
}

function hideInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
        installBtn.remove();
    }
}

async function installPWA() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        console.log('PWA install accepted');
    } else {
        console.log('PWA install dismissed');
    }

    deferredPrompt = null;
    hideInstallButton();
}

// Enhanced touch gesture support
function setupTouchGestures() {
    let startX, startY;

    document.addEventListener(
        'touchstart',
        e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        },
        { passive: true }
    );

    document.addEventListener(
        'touchend',
        e => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe detection (for navigation)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const sections = ['home', 'gallery', 'stories', 'game'];
                const currentSection = document.querySelector('.section.active')?.id;
                const currentIndex = sections.indexOf(currentSection);

                if (diffX > 0 && currentIndex < sections.length - 1) {
                    // Swipe left - next section
                    const nextSection = sections[currentIndex + 1];
                    document.querySelector(`[data-section="${nextSection}"]`).click();
                } else if (diffX < 0 && currentIndex > 0) {
                    // Swipe right - previous section
                    const prevSection = sections[currentIndex - 1];
                    document.querySelector(`[data-section="${prevSection}"]`).click();
                }
            }

            startX = startY = null;
        },
        { passive: true }
    );
}

// Mobile-specific optimizations
function setupMobileOptimizations() {
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        });

        input.addEventListener('blur', () => {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
            );
        });
    });

    // Optimize game button interactions for touch
    const gameButtons = document.querySelectorAll('.game-btn');
    gameButtons.forEach(btn => {
        btn.addEventListener(
            'touchstart',
            function () {
                this.style.transform = 'scale(0.95)';
            },
            { passive: true }
        );

        btn.addEventListener(
            'touchend',
            function () {
                this.style.transform = '';
            },
            { passive: true }
        );
    });
}

// Offline detection and notifications
function setupOfflineHandling() {
    function updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';
        document.body.className = document.body.className.replace(/\b(online|offline)\b/g, '') + ` ${status}`;

        if (!navigator.onLine) {
            showMessage(
                '📱 You are offline. Game data is saved locally and will sync when connection is restored.',
                'success'
            );
        } else {
            showMessage('🌐 Connection restored! Welcome back online.', 'success');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial status
    updateOnlineStatus();
}

// Performance monitoring for mobile
function setupPerformanceMonitoring() {
    // Monitor memory usage on mobile
    if (performance.memory) {
        setInterval(() => {
            const memoryInfo = performance.memory;
            const usedPercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;

            if (usedPercent > 80) {
                console.warn('High memory usage detected:', usedPercent + '%');
                // Could trigger garbage collection or cleanup
            }
        }, 30000); // Check every 30 seconds
    }

    // Monitor long tasks that could affect responsiveness
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                if (entry.duration > 50) {
                    // Tasks longer than 50ms
                    console.warn('Long task detected:', entry.duration + 'ms');
                }
            });
        });

        try {
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Longtask observer not supported
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    checkAuth();
    loadHome();
    loadGallery();
    loadStories();
    loadGame();
    if (dataManager.isAuthenticated()) {
        loadAdmin();
    }

    // Initialize PWA and mobile features
    registerServiceWorker();
    setupPWAInstall();
    setupTouchGestures();
    setupMobileOptimizations();
    setupOfflineHandling();
    setupPerformanceMonitoring();
});
