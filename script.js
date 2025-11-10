// Data Storage using LocalStorage
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        if (!localStorage.getItem('silas-bio')) {
            localStorage.setItem('silas-bio', "Hi! I'm Silas Anderson, and I love exploring new worlds through anime and games!");
        }
        if (!localStorage.getItem('silas-interests')) {
            localStorage.setItem('silas-interests', JSON.stringify([
                '🎌 Anime',
                '🐱 Cats',
                '🗺️ Adventure Games',
                '👊 Fighting Games'
            ]));
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
            battleTurn: 'player'
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
        link.addEventListener('click', (e) => {
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
    interestsDisplay.innerHTML = interests.map(interest => 
        `<div class="interest-tag">${escapeHtml(interest)}</div>`
    ).join('');
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
        galleryGrid.innerHTML = pictures.map((pic, index) => `
            <div class="gallery-item">
                <img src="${escapeHtml(pic.url)}" alt="${escapeHtml(pic.caption)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect width=%22250%22 height=%22250%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22%3EImage Not Found%3C/text%3E%3C/svg%3E'">
                <div class="gallery-caption">${escapeHtml(pic.caption)}</div>
                <button class="delete-btn" onclick="deletePicture(${index})">×</button>
            </div>
        `).join('');
    }
}

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
        storiesList.innerHTML = stories.map((story, index) => `
            <div class="story-item">
                <h3>${escapeHtml(story.title)}</h3>
                <p>${escapeHtml(story.content)}</p>
                <button class="delete-btn" onclick="deleteStory(${index})">Delete</button>
            </div>
        `).join('');
    }
}

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
        message: "You stand at the castle gates. The morning sun shines on your armor.",
        image: "🏰"
    },
    forest: {
        message: "You venture into the mysterious forest. Strange sounds echo through the trees.",
        image: "🌲"
    },
    cave: {
        message: "You enter a dark cave. You hear something moving in the shadows...",
        image: "🕳️"
    },
    mountain: {
        message: "You climb the snowy mountain peak. The view is breathtaking!",
        image: "⛰️"
    },
    village: {
        message: "You arrive at a peaceful village. The locals greet you warmly.",
        image: "🏘️"
    }
};

const encounters = [
    // Common enemies (60% spawn rate)
    { name: "Slime", image: "🟢", xp: 20, gold: 10, attack: 8, hp: 25, rarity: "common", loot: ["Health Potion"] },
    { name: "Goblin", image: "👺", xp: 35, gold: 25, attack: 12, hp: 40, rarity: "common", loot: ["Bronze Dagger", "Gold Coins"] },
    { name: "Wolf", image: "🐺", xp: 40, gold: 20, attack: 15, hp: 35, rarity: "common", loot: ["Wolf Pelt", "Health Potion"] },
    
    // Uncommon enemies (30% spawn rate)
    { name: "Orc Warrior", image: "👹", xp: 60, gold: 40, attack: 20, hp: 60, rarity: "uncommon", loot: ["Iron Axe", "Shield"] },
    { name: "Dark Mage", image: "🧙‍♂️", xp: 70, gold: 50, attack: 25, hp: 45, rarity: "uncommon", loot: ["Magic Staff", "Mana Potion"] },
    { name: "Skeleton Knight", image: "💀", xp: 65, gold: 45, attack: 22, hp: 55, rarity: "uncommon", loot: ["Bone Sword", "Ancient Coin"] },
    
    // Rare enemies (8% spawn rate)
    { name: "Troll Champion", image: "👹", xp: 120, gold: 80, attack: 35, hp: 100, rarity: "rare", loot: ["Troll Club", "Rare Gem"] },
    { name: "Fire Elemental", image: "🔥", xp: 110, gold: 75, attack: 30, hp: 80, rarity: "rare", loot: ["Flame Sword", "Fire Crystal"] },
    
    // Epic boss (2% spawn rate)
    { name: "Ancient Dragon", image: "🐉", xp: 300, gold: 200, attack: 50, hp: 200, rarity: "boss", loot: ["Dragon Blade", "Dragon Scale Armor", "Legendary Gem"] }
];

const equipment = {
    weapons: [
        { name: "Iron Sword", attack: 10, cost: 100, rarity: "common" },
        { name: "Bronze Dagger", attack: 8, cost: 75, rarity: "common" },
        { name: "Steel Sword", attack: 18, cost: 250, rarity: "uncommon" },
        { name: "Iron Axe", attack: 22, cost: 300, rarity: "uncommon" },
        { name: "Magic Staff", attack: 25, cost: 400, rarity: "rare" },
        { name: "Flame Sword", attack: 30, cost: 600, rarity: "rare" },
        { name: "Dragon Blade", attack: 45, cost: 1500, rarity: "legendary" }
    ],
    armor: [
        { name: "Leather Armor", defense: 5, cost: 80, rarity: "common" },
        { name: "Chain Mail", defense: 12, cost: 200, rarity: "uncommon" },
        { name: "Steel Plate", defense: 20, cost: 500, rarity: "rare" },
        { name: "Dragon Scale Armor", defense: 35, cost: 2000, rarity: "legendary" }
    ]
};

const characterClasses = {
    warrior: {
        name: "🗡️ Warrior",
        description: "Master of melee combat with high HP and defense",
        bonuses: { hp: 20, attack: 5, defense: 3, mana: -10 },
        skills: ["berserker_rage", "shield_bash", "war_cry"],
        ultimate: "devastating_blow"
    },
    archer: {
        name: "🏹 Archer", 
        description: "Expert marksman with high critical hit chance",
        bonuses: { hp: 0, attack: 3, defense: 0, critChance: 15, mana: 0 },
        skills: ["multi_shot", "aimed_shot", "evasion"],
        ultimate: "arrow_storm"
    },
    mage: {
        name: "🧙‍♂️ Mage",
        description: "Wielder of arcane magic with powerful spells",
        bonuses: { hp: -10, attack: 2, defense: -2, mana: 30 },
        skills: ["fireball", "heal", "magic_shield"],
        ultimate: "meteor"
    },
    rogue: {
        name: "🗡️ Rogue",
        description: "Stealthy assassin with high dodge and critical hits",
        bonuses: { hp: -5, attack: 4, defense: 0, critChance: 10, dodgeChance: 15, mana: 5 },
        skills: ["backstab", "stealth", "poison_blade"],
        ultimate: "shadow_strike"
    }
};

const skills = {
    // Warrior Skills
    berserker_rage: {
        name: "🔥 Berserker Rage",
        description: "+50% attack for 3 turns",
        manaCost: 15,
        cooldown: 5,
        effect: "buff_attack"
    },
    shield_bash: {
        name: "🛡️ Shield Bash", 
        description: "Attack that reduces enemy attack",
        manaCost: 10,
        cooldown: 3,
        effect: "debuff_enemy_attack"
    },
    war_cry: {
        name: "📢 War Cry",
        description: "Intimidate enemy, reduce their accuracy",
        manaCost: 8,
        cooldown: 4,
        effect: "debuff_enemy_accuracy"
    },
    devastating_blow: {
        name: "💥 Devastating Blow",
        description: "Ultimate: 300% damage attack",
        manaCost: 30,
        cooldown: 8,
        effect: "ultimate_attack"
    },
    
    // Archer Skills
    multi_shot: {
        name: "🏹 Multi Shot",
        description: "Hit enemy 2-3 times with reduced damage",
        manaCost: 12,
        cooldown: 3,
        effect: "multi_attack"
    },
    aimed_shot: {
        name: "🎯 Aimed Shot",
        description: "Guaranteed critical hit",
        manaCost: 15,
        cooldown: 4,
        effect: "guaranteed_crit"
    },
    evasion: {
        name: "💨 Evasion",
        description: "+75% dodge chance for 2 turns",
        manaCost: 10,
        cooldown: 5,
        effect: "buff_dodge"
    },
    arrow_storm: {
        name: "🌪️ Arrow Storm",
        description: "Ultimate: 5 attacks with increasing damage",
        manaCost: 35,
        cooldown: 10,
        effect: "ultimate_multi"
    },
    
    // Mage Skills
    fireball: {
        name: "🔥 Fireball",
        description: "Magic damage that ignores armor",
        manaCost: 12,
        cooldown: 2,
        effect: "magic_damage"
    },
    heal: {
        name: "💚 Heal",
        description: "Restore 40% of max HP",
        manaCost: 15,
        cooldown: 4,
        effect: "heal_self"
    },
    magic_shield: {
        name: "🔮 Magic Shield",
        description: "Absorb next 2 attacks completely",
        manaCost: 20,
        cooldown: 6,
        effect: "magic_shield"
    },
    meteor: {
        name: "☄️ Meteor",
        description: "Ultimate: Massive magic damage",
        manaCost: 40,
        cooldown: 12,
        effect: "ultimate_magic"
    },
    
    // Rogue Skills
    backstab: {
        name: "🗡️ Backstab",
        description: "High damage with guaranteed critical",
        manaCost: 15,
        cooldown: 4,
        effect: "backstab_attack"
    },
    stealth: {
        name: "👤 Stealth",
        description: "Next attack deals double damage",
        manaCost: 12,
        cooldown: 5,
        effect: "stealth_buff"
    },
    poison_blade: {
        name: "☠️ Poison Blade",
        description: "Poison enemy for damage over time",
        manaCost: 10,
        cooldown: 3,
        effect: "apply_poison"
    },
    shadow_strike: {
        name: "🌑 Shadow Strike",
        description: "Ultimate: Teleport attack with massive damage",
        manaCost: 35,
        cooldown: 10,
        effect: "ultimate_stealth"
    }
};

const achievements = [
    { id: "first_kill", name: "First Blood", description: "Defeat your first enemy", reward: 50 },
    { id: "explorer", name: "Explorer", description: "Explore 10 locations", reward: 100 },
    { id: "treasure_hunter", name: "Treasure Hunter", description: "Find 500 gold", reward: 200 },
    { id: "level_master", name: "Level Master", description: "Reach level 10", reward: 500 },
    { id: "dragon_slayer", name: "Dragon Slayer", description: "Defeat the Ancient Dragon", reward: 1000 },
    { id: "boss_hunter", name: "Boss Hunter", description: "Defeat 5 boss enemies", reward: 750 },
    { id: "skill_master", name: "Skill Master", description: "Use 50 skills in combat", reward: 300 },
    { id: "class_master", name: "Class Master", description: "Master your chosen class", reward: 500 }
];

function loadGame() {
    updateGameDisplay();
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
    state.explorationCount = (state.explorationCount || 0) + 1;
    
    const locations = Object.keys(gameScenarios);
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const scenario = gameScenarios[randomLocation];
    
    state.currentLocation = randomLocation;
    
    // Enhanced encounter system (60% chance)
    if (Math.random() < 0.6) {
        const encounter = selectRandomEncounter();
        
        document.getElementById('game-message').textContent = 
            `${scenario.message}\n\nA ${encounter.rarity} ${encounter.name} appears! ${encounter.image}`;
        document.getElementById('game-image').textContent = encounter.image;
        
        // Start turn-based battle
        startBattle(state, encounter);
        dataManager.saveGameState(state);
        return; // Exit explore function, battle will handle the rest
    } else {
        // Enhanced treasure system
        const treasureType = Math.random();
        let message = `${scenario.message}\n\n`;
        
        if (treasureType < 0.7) {
            // Gold treasure
            const goldFound = Math.floor(Math.random() * 50) + 20;
            state.gold += goldFound;
            message += `💰 You found ${goldFound} gold coins!`;
        } else if (treasureType < 0.9) {
            // Equipment treasure
            const equipmentType = Math.random() < 0.5 ? 'weapons' : 'armor';
            const items = equipment[equipmentType].filter(item => item.rarity === 'common' || item.rarity === 'uncommon');
            const foundEquipment = items[Math.floor(Math.random() * items.length)];
            
            state.inventory = state.inventory || [];
            state.inventory.push(foundEquipment);
            message += `⚔️ You found ${foundEquipment.name}! Added to inventory.`;
        } else {
            // Rare gem
            const gemValue = Math.floor(Math.random() * 100) + 50;
            state.gold += gemValue;
            message += `💎 You found a rare gem worth ${gemValue} gold!`;
        }
        
        document.getElementById('game-message').textContent = message;
        document.getElementById('game-image').textContent = scenario.image;
    }
    
    // Check achievements
    checkAchievements(state);
    
    dataManager.saveGameState(state);
    updateGameDisplay();
}

function selectRandomEncounter() {
    const rand = Math.random();
    
    if (rand < 0.02) {
        // 2% chance for boss
        return encounters.find(e => e.rarity === 'boss');
    } else if (rand < 0.10) {
        // 8% chance for rare
        const rareEnemies = encounters.filter(e => e.rarity === 'rare');
        return rareEnemies[Math.floor(Math.random() * rareEnemies.length)];
    } else if (rand < 0.40) {
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
    // Initialize battle state
    enemy.currentHp = enemy.hp;
    enemy.maxHp = enemy.hp;
    enemy.statusEffects = {};
    
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
    
    let battleLog = "";
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
            
        case 'defend':
            const healAmount = Math.floor(state.maxHp * 0.1);
            state.hp = Math.min(state.maxHp, state.hp + healAmount);
            state.defendingThisTurn = true;
            battleLog = `🛡️ You defend and recover ${healAmount} HP!`;
            break;
            
        case 'skill':
            const result = useSkill(state, enemy, skillKey);
            if (!result.success) {
                document.getElementById('game-message').textContent = result.message;
                return;
            }
            playerDamage = result.damage || 0;
            manaCost = result.manaCost || 0;
            battleLog = result.message;
            break;
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
    let battleLog = previousLog + "\n\n";
    
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
    
    document.getElementById('game-message').textContent = battleLog + "\n\n🎯 Your turn! Choose your action:";
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
        return { success: false, message: "❌ Skill not found!" };
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
            
        case 'heal_self':
            const healAmount = Math.floor(state.maxHp * 0.4);
            state.hp = Math.min(state.maxHp, state.hp + healAmount);
            message += `Restored ${healAmount} HP!`;
            break;
            
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

function processStatusEffects(state, enemy) {
    // Process any status effects here (poison, buffs, etc.)
}

function endBattle(state, victory, battleLog) {
    const enemy = state.currentEnemy;
    let finalMessage = battleLog + "\n\n";
    
    if (victory) {
        // Victory rewards
        state.xp += enemy.xp;
        state.gold += enemy.gold;
        
        finalMessage += `🎉 VICTORY! 🎉\n`;
        finalMessage += `💀 Defeated ${enemy.name}!\n`;
        finalMessage += `✨ +${enemy.xp} XP\n`;
        finalMessage += `💰 +${enemy.gold} Gold\n`;
        
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
        }
        
        // Level up check
        const leveledUp = checkLevelUp(state);
        if (leveledUp) {
            finalMessage += `\n🎉 LEVEL UP! Now level ${state.level}!\n`;
            finalMessage += `❤️ HP restored! Stats increased!\n`;
        }
        
    } else {
        finalMessage += `💀 DEFEAT! 💀\n`;
        finalMessage += `You were defeated by ${enemy.name}!\n`;
        finalMessage += `Click 'New Game' to try again.\n`;
    }
    
    // Clean up battle state
    state.inBattle = false;
    state.currentEnemy = null;
    state.battleTurn = 'player';
    state.statusEffects = {};
    
    document.getElementById('game-message').textContent = finalMessage;
    document.getElementById('game-image').textContent = victory ? "🎉" : "💀";
    
    checkAchievements(state);
    dataManager.saveGameState(state);
    updateGameDisplay();
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
                alert(`🏆 Achievement Unlocked!\n${achievement.name}\n${achievement.description}\n+${achievement.reward} Gold Reward!`);
            }, 100);
        }
    });
    
    state.achievements = unlockedAchievements;
}

function rest() {
    const state = dataManager.getGameState();
    
    if (state.hp === state.maxHp) {
        document.getElementById('game-message').textContent = 
            "You are already at full health!";
        return;
    }
    
    const healAmount = Math.floor(state.maxHp * 0.5);
    state.hp = Math.min(state.maxHp, state.hp + healAmount);
    
    document.getElementById('game-message').textContent = 
        `You rest at a campfire. 🔥\n\n+${healAmount} HP restored!`;
    document.getElementById('game-image').textContent = "😴";
    
    dataManager.saveGameState(state);
    updateGameDisplay();
}

function shop() {
    const state = dataManager.getGameState();
    
    let shopMessage = "🏪 ⚔️ ADVENTURE SHOP ⚔️ 🏪\n\n";
    shopMessage += `Your Gold: ${state.gold} 💰\n\n`;
    shopMessage += "=== CONSUMABLES ===\n";
    shopMessage += "1. Health Potion - 50 Gold (Restore 50 HP)\n";
    shopMessage += "2. Max HP Upgrade - 200 Gold (+30 Max HP)\n\n";
    
    shopMessage += "=== WEAPONS ===\n";
    const availableWeapons = equipment.weapons.filter(w => w.cost <= state.gold * 2);
    availableWeapons.slice(0, 3).forEach((weapon, index) => {
        shopMessage += `${index + 3}. ${weapon.name} - ${weapon.cost} Gold (+${weapon.attack} Attack)\n`;
    });
    
    shopMessage += "\n=== ARMOR ===\n";
    const availableArmor = equipment.armor.filter(a => a.cost <= state.gold * 2);
    availableArmor.slice(0, 3).forEach((armor, index) => {
        shopMessage += `${index + 6}. ${armor.name} - ${armor.cost} Gold (+${armor.defense} Defense)\n`;
    });
    
    shopMessage += "\nEnter number to buy, 'i' for inventory, or any other key to leave.";
    
    const choice = prompt(shopMessage);
    
    if (choice === "1" && state.gold >= 50) {
        state.gold -= 50;
        state.hp = Math.min(state.maxHp, state.hp + 50);
        document.getElementById('game-message').textContent = 
            "🧪 You bought a Health Potion! +50 HP restored!";
    } else if (choice === "2" && state.gold >= 200) {
        state.gold -= 200;
        state.maxHp += 30;
        state.hp += 30;
        document.getElementById('game-message').textContent = 
            "💪 You bought a Max HP Upgrade! +30 Max HP permanently!";
    } else if (choice >= "3" && choice <= "5") {
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
                document.getElementById('game-message').textContent = 
                    "💸 Not enough gold for that weapon!";
            }
        }
    } else if (choice >= "6" && choice <= "8") {
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
                document.getElementById('game-message').textContent = 
                    "💸 Not enough gold for that armor!";
            }
        }
    } else if (choice.toLowerCase() === "i") {
        showInventory(state);
        return; // Don't update display yet
    } else if (["1", "2", "3", "4", "5", "6", "7", "8"].includes(choice)) {
        document.getElementById('game-message').textContent = 
            "💸 Not enough gold for that item!";
    } else {
        document.getElementById('game-message').textContent = 
            "👋 Thanks for visiting the shop! Come back anytime!";
    }
    
    document.getElementById('game-image').textContent = "🏪";
    
    dataManager.saveGameState(state);
    updateGameDisplay();
}

function showInventory(state) {
    const inventory = state.inventory || [];
    
    if (inventory.length === 0) {
        document.getElementById('game-message').textContent = 
            "🎒 Your inventory is empty! Find items while exploring or buy them from the shop.";
        document.getElementById('game-image').textContent = "🎒";
        return;
    }
    
    let inventoryMessage = "🎒 === YOUR INVENTORY === 🎒\n\n";
    inventory.forEach((item, index) => {
        if (typeof item === 'string') {
            inventoryMessage += `${index + 1}. ${item}\n`;
        } else {
            inventoryMessage += `${index + 1}. ${item.name} (${item.rarity})\n`;
        }
    });
    
    inventoryMessage += "\nYour inventory contains items you've found during your adventures!";
    
    document.getElementById('game-message').textContent = inventoryMessage;
    document.getElementById('game-image').textContent = "🎒";
}

function chooseClass() {
    let classMessage = "🎭 === CHOOSE YOUR CLASS === 🎭\n\n";
    
    Object.keys(characterClasses).forEach((classKey, index) => {
        const classData = characterClasses[classKey];
        classMessage += `${index + 1}. ${classData.name}\n`;
        classMessage += `   ${classData.description}\n\n`;
    });
    
    classMessage += "Enter 1-4 to choose your class:";
    
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
            "Invalid choice! Please restart and choose a valid class (1-4).";
        return false;
    }
}

function showStats() {
    const state = dataManager.getGameState();
    const classData = characterClasses[state.class] || characterClasses.warrior;
    
    let statsMessage = "📊 === CHARACTER STATS === 📊\n\n";
    statsMessage += `🦸 Name: ${state.name}\n`;
    statsMessage += `🎭 Class: ${classData.name}\n`;
    statsMessage += `⭐ Level: ${state.level}\n`;
    statsMessage += `✨ XP: ${state.xp}/${state.xpNeeded}\n`;
    statsMessage += `❤️ HP: ${state.hp}/${state.maxHp}\n`;
    statsMessage += `� Mana: ${state.mana || 50}/${state.maxMana || 50}\n`;
    statsMessage += `�💰 Gold: ${state.gold}\n\n`;
    
    statsMessage += "=== COMBAT STATS ===\n";
    statsMessage += `⚔️ Attack: ${state.attack || 15}\n`;
    statsMessage += `🛡️ Defense: ${state.defense || 5}\n`;
    statsMessage += `💥 Crit Chance: ${state.critChance || 10}%\n`;
    statsMessage += `💨 Dodge Chance: ${state.dodgeChance || 5}%\n\n`;
    
    statsMessage += "=== EQUIPMENT ===\n";
    statsMessage += `⚔️ Weapon: ${state.equipment?.weapon?.name || 'Iron Sword'}\n`;
    statsMessage += `🛡️ Armor: ${state.equipment?.armor?.name || 'Leather Armor'}\n\n`;
    
    statsMessage += "=== SKILLS ===\n";
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
        statsMessage += "No skills unlocked yet.\n";
    }
    
    statsMessage += "\n=== ACHIEVEMENTS ===\n";
    const unlockedCount = (state.achievements || []).length;
    statsMessage += `🏆 Unlocked: ${unlockedCount}/${achievements.length}\n`;
    statsMessage += `🗺️ Explorations: ${state.explorationCount || 0}\n`;
    statsMessage += `👑 Bosses Defeated: ${state.bossesDefeated || 0}\n`;
    
    if (unlockedCount > 0) {
        statsMessage += "\n=== UNLOCKED ACHIEVEMENTS ===\n";
        (state.achievements || []).forEach(achievementId => {
            const achievement = achievements.find(a => a.id === achievementId);
            if (achievement) {
                statsMessage += `🏆 ${achievement.name}\n`;
            }
        });
    }
    
    document.getElementById('game-message').textContent = statsMessage;
    document.getElementById('game-image').textContent = "📊";
}

function resetGame() {
    if (confirm('Are you sure you want to start a new game? All progress will be lost.')) {
        dataManager.resetGame();
        document.getElementById('game-message').textContent = 
            "New adventure started! Good luck, brave hero!";
        document.getElementById('game-image').textContent = "🏰";
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
    
    interestsEditor.innerHTML = interests.map((interest, index) => `
        <div class="interest-tag-editable">
            <span>${escapeHtml(interest)}</span>
            <button onclick="removeInterest(${index})">×</button>
        </div>
    `).join('');
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
document.getElementById('login-password').addEventListener('keypress', (e) => {
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
document.getElementById('choose-class-btn').addEventListener('click', chooseClass);
document.getElementById('reset-game-btn').addEventListener('click', resetGame);

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

function showSkillMenu() {
    const state = dataManager.getGameState();
    const availableSkills = state.skills?.available || [];
    
    if (availableSkills.length === 0) {
        document.getElementById('game-message').textContent += '\n\n❌ No skills available!';
        return;
    }
    
    let skillMessage = "✨ === CHOOSE SKILL === ✨\n\n";
    
    availableSkills.forEach((skillKey, index) => {
        const skill = skills[skillKey];
        const cooldown = state.skills?.cooldowns?.[skillKey] || 0;
        const canUse = cooldown === 0 && state.mana >= skill.manaCost;
        const status = cooldown > 0 ? `(${cooldown} turns)` : 
                      state.mana < skill.manaCost ? `(${skill.manaCost} mana)` : '✅';
        
        skillMessage += `${index + 1}. ${skill.name} ${status}\n`;
        skillMessage += `   ${skill.description}\n`;
        skillMessage += `   Mana: ${skill.manaCost} | Cooldown: ${skill.cooldown}\n\n`;
    });
    
    skillMessage += "Enter 1-" + availableSkills.length + " to use skill, or any other key to cancel:";
    
    const choice = prompt(skillMessage);
    const skillIndex = parseInt(choice) - 1;
    
    if (skillIndex >= 0 && skillIndex < availableSkills.length) {
        const skillKey = availableSkills[skillIndex];
        performPlayerAction('skill', skillKey);
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
});
