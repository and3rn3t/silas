# Silas Anderson - Personal Website AI Instructions

## Project Overview
This is a **client-side personal website** for an 11-year-old that combines a portfolio/blog with an embedded mini RPG game. The entire application runs in the browser using pure HTML, CSS, and JavaScript with LocalStorage persistence - **no server or build process required**.

## Architecture & Key Components

### Data Layer (`DataManager` class in `script.js`)
- **LocalStorage-based persistence** - all user data stored in browser
- **Session-based authentication** - uses sessionStorage for login state
- **Default data initialization** - sets up bio, interests, empty collections on first run
- **Game state management** - handles RPG character progression and saves

### Core Modules
1. **Content Management** - bio, interests, gallery (image URLs + captions), stories
2. **Authentication System** - password-protected edit mode with session expiry
3. **Adventure Game Engine** - turn-based RPG with locations, encounters, leveling
4. **Single-Page App Navigation** - section switching without page reloads

### Security Model
- **Default password**: `silas123` (stored in localStorage)
- **Edit mode access** controlled by sessionStorage authentication
- **XSS protection** via `escapeHtml()` helper for user content
- **Session expiry** on browser close (sessionStorage behavior)

## Development Patterns

### Content Updates
- All content changes go through `DataManager` methods
- UI updates triggered by explicit `load*()` function calls
- **Pattern**: `dataManager.addStory(story)` → `loadStories()` → UI refresh

### Game Mechanics
- **Exploration system**: 50/50 chance treasure vs monster encounter
- **Progressive leveling**: XP requirements scale by 1.5x per level
- **Shop system**: uses browser `prompt()` for item selection
- **Locations**: defined in `gameScenarios` object with emojis + descriptions

### Error Handling
- **Image fallback**: SVG placeholder for broken gallery images
- **Validation**: input checking with `showMessage()` user feedback
- **Graceful degradation**: empty states with helpful messages

## Key Files & Structure
- `index.html` - Single-page app with all sections and navigation
- `script.js` - All JavaScript logic in one file (DataManager + UI functions)  
- `styles.css` - Complete styling with responsive design and animations
- `USER_GUIDE.md` - End-user documentation for Silas

## Testing & Debugging
- **Quick test**: Open `index.html` in browser, verify navigation works
- **Authentication test**: Try login with `silas123`, check Edit section access
- **Game test**: Click "Explore" multiple times, verify XP/level progression
- **Data persistence test**: Add content, refresh browser, verify data remains

## Common Modifications
- **Content updates**: Edit default bio/interests in `DataManager.initializeData()`
- **Game balancing**: Modify `encounters` array or XP scaling in leveling logic
- **Styling changes**: Update CSS custom properties or component styles
- **New features**: Add to existing sections rather than creating new HTML structure

## Browser Compatibility Notes
- **LocalStorage dependency** - requires modern browser (IE8+)
- **No external CDNs** - fully self-contained
- **Mobile responsive** - uses CSS Grid and Flexbox
- **Emoji support** - ensure target browsers support Unicode emojis