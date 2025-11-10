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
            currentLocation: 'castle'
        };
        this.saveGameState(initialState);
    }
}

// Initialize Data Manager
const dataManager = new DataManager();

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show selected section
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Home Section
function loadHome() {
    const bioDisplay = document.getElementById('bio-display');
    const interestsDisplay = document.getElementById('interests-display');

    bioDisplay.innerHTML = `<p>${dataManager.getBio()}</p>`;

    const interests = dataManager.getInterests();
    interestsDisplay.innerHTML = interests.map(interest => 
        `<div class="interest-tag">${interest}</div>`
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
                <img src="${pic.url}" alt="${pic.caption}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22250%22%3E%3Crect width=%22250%22 height=%22250%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22%3EImage Not Found%3C/text%3E%3C/svg%3E'">
                <div class="gallery-caption">${pic.caption}</div>
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
                <h3>${story.title}</h3>
                <p>${story.content}</p>
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
    { name: "Slime", image: "🟢", xp: 20, gold: 10, damage: 5 },
    { name: "Goblin", image: "👺", xp: 35, gold: 25, damage: 10 },
    { name: "Wolf", image: "🐺", xp: 40, gold: 20, damage: 12 },
    { name: "Skeleton", image: "💀", xp: 50, gold: 30, damage: 15 },
    { name: "Dragon", image: "🐉", xp: 100, gold: 100, damage: 25 }
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
}

function explore() {
    const state = dataManager.getGameState();
    const locations = Object.keys(gameScenarios);
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const scenario = gameScenarios[randomLocation];
    
    state.currentLocation = randomLocation;
    
    // Random encounter (50% chance)
    if (Math.random() < 0.5) {
        const encounter = encounters[Math.floor(Math.random() * encounters.length)];
        
        document.getElementById('game-message').textContent = 
            `${scenario.message}\n\nA wild ${encounter.name} appears! ${encounter.image}`;
        document.getElementById('game-image').textContent = encounter.image;
        
        // Battle
        const damage = Math.floor(Math.random() * encounter.damage);
        state.hp = Math.max(0, state.hp - damage);
        
        if (state.hp > 0) {
            state.xp += encounter.xp;
            state.gold += encounter.gold;
            
            // Check for level up
            while (state.xp >= state.xpNeeded) {
                state.level++;
                state.xp -= state.xpNeeded;
                state.xpNeeded = Math.floor(state.xpNeeded * 1.5);
                state.maxHp += 20;
                state.hp = state.maxHp;
                
                setTimeout(() => {
                    alert(`🎉 Level Up! You are now level ${state.level}! HP fully restored!`);
                }, 100);
            }
            
            document.getElementById('game-message').textContent += 
                `\n\nYou defeated the ${encounter.name}! You took ${damage} damage.\n+${encounter.xp} XP, +${encounter.gold} Gold`;
        } else {
            document.getElementById('game-message').textContent += 
                `\n\n💀 You were defeated! Game Over. Click 'New Game' to try again.`;
        }
    } else {
        // Safe exploration
        const goldFound = Math.floor(Math.random() * 30) + 10;
        state.gold += goldFound;
        
        document.getElementById('game-message').textContent = 
            `${scenario.message}\n\nYou found ${goldFound} gold coins! 💰`;
        document.getElementById('game-image').textContent = scenario.image;
    }
    
    dataManager.saveGameState(state);
    updateGameDisplay();
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
    
    const items = [
        { name: "Health Potion", cost: 50, effect: "Restore 50 HP" },
        { name: "Max HP Upgrade", cost: 100, effect: "+20 Max HP" }
    ];
    
    let shopMessage = "🏪 Welcome to the Shop!\n\n";
    shopMessage += "Your Gold: " + state.gold + "\n\n";
    shopMessage += "1. Health Potion - 50 Gold (Restore 50 HP)\n";
    shopMessage += "2. Max HP Upgrade - 100 Gold (+20 Max HP)\n\n";
    shopMessage += "Enter 1 or 2 to buy, or any other key to leave.";
    
    const choice = prompt(shopMessage);
    
    if (choice === "1" && state.gold >= 50) {
        state.gold -= 50;
        state.hp = Math.min(state.maxHp, state.hp + 50);
        document.getElementById('game-message').textContent = 
            "You bought a Health Potion! +50 HP";
    } else if (choice === "2" && state.gold >= 100) {
        state.gold -= 100;
        state.maxHp += 20;
        state.hp += 20;
        document.getElementById('game-message').textContent = 
            "You bought a Max HP Upgrade! +20 Max HP";
    } else if (choice === "1" || choice === "2") {
        document.getElementById('game-message').textContent = 
            "Not enough gold!";
    } else {
        document.getElementById('game-message').textContent = 
            "You left the shop.";
    }
    
    document.getElementById('game-image').textContent = "🏪";
    
    dataManager.saveGameState(state);
    updateGameDisplay();
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
            <span>${interest}</span>
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
document.getElementById('save-bio-btn').addEventListener('click', saveBio);
document.getElementById('add-interest-btn').addEventListener('click', addInterest);
document.getElementById('add-picture-btn').addEventListener('click', addPicture);
document.getElementById('add-story-btn').addEventListener('click', addStory);
document.getElementById('explore-btn').addEventListener('click', explore);
document.getElementById('rest-btn').addEventListener('click', rest);
document.getElementById('shop-btn').addEventListener('click', shop);
document.getElementById('reset-game-btn').addEventListener('click', resetGame);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadHome();
    loadGallery();
    loadStories();
    loadGame();
    loadAdmin();
});
