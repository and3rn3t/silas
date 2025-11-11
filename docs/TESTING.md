# Silas Anderson's Personal Website - Testing Documentation

## 🧪 Testing Overview

This project includes comprehensive automated testing to ensure Silas's personal
website and embedded RPG game work perfectly across all browsers and devices.

## 📊 Test Coverage

- ✅ **31 Unit Tests** - Core functionality and game mechanics
- ✅ **Cross-Browser E2E Tests** - Chrome, Firefox, Safari, Mobile
- ✅ **Security & Performance Audits** - Automated vulnerability scanning
- ✅ **CI/CD Pipeline** - Automated testing and deployment

## 🚀 Quick Start

### Running All Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Development Testing

```bash
# Watch mode for unit tests during development
npm run test:watch

# Start local server for manual testing
npm run serve
```

### ⚡ Speed-Optimized E2E Testing

```bash
# Fastest - Chromium only with parallel workers (recommended for local dev)
npm run test:e2e:fast

# Quick parallel execution with 4 workers
npm run test:e2e:quick

# Smoke tests only (navigation tests, ~30 seconds)
npm run test:e2e:smoke

# Full suite all browsers (~2-3 minutes)
npm run test:e2e

# Interactive UI mode (great for debugging)
npm run test:e2e:ui
```

**Performance Tips:**

- 🚀 **75% faster**: Use `test:e2e:fast` for quick feedback during development
- 🔄 **Parallel execution**: Automatically uses 75% of CPU cores locally
- 📊 **Line reporter**: Faster terminal output (HTML reports only on CI)
- ⚡ **Shorter timeouts**: 5s locally vs 15s on CI for faster failures
- 🔁 **Server reuse**: Development server stays running between test runs

## 🔧 Test Structure

### Unit Tests (`tests/`)

- **`gameData.test.js`** - Validates RPG game data integrity
    - Character classes and abilities
    - Equipment balance and pricing
    - Quest system validation
    - Location and encounter data

- **`dataManagerCore.test.js`** - Core application functionality
    - Data persistence (localStorage)
    - Authentication system
    - Content management (bio, stories, gallery)
    - Game state management

### End-to-End Tests (`tests/e2e/`)

- **`navigation.spec.js`** - Multi-device navigation testing
- **`game.spec.js`** - Complete RPG gameplay workflows
- **`auth.spec.js`** - Security and edit mode functionality

## 🌐 Browser Testing Matrix

| Browser | Desktop | Mobile | Status       |
| ------- | ------- | ------ | ------------ |
| Chrome  | ✅      | ✅     | Full Support |
| Firefox | ✅      | ✅     | Full Support |
| Safari  | ✅      | ✅     | Full Support |
| Edge    | ✅      | ✅     | Full Support |

## 📈 Continuous Integration

### GitHub Actions Pipeline

- **Test Stage**: Unit tests + E2E tests across multiple browsers
- **Lint Stage**: Code quality and formatting checks
- **Security Stage**: Vulnerability scanning and dependency audits
- **Performance Stage**: Lighthouse CI performance testing
- **Deploy Stage**: Automatic deployment to Cloudflare Pages (main branch)

### Quality Gates

- ✅ All unit tests must pass
- ✅ E2E tests must pass on all browsers
- ✅ No high/critical security vulnerabilities
- ✅ Code must pass linting checks
- ✅ Performance score > 90 (Lighthouse)

## 🛡️ Security Testing

### Automated Security Scans

- **Dependency Auditing**: Checks for known vulnerabilities in npm packages
- **XSS Protection**: Validates HTML escaping in user content
- **Authentication Testing**: Verifies login/logout flows work correctly

### Manual Security Checklist

- [ ] Test password protection on edit mode
- [ ] Verify content sanitization prevents XSS
- [ ] Check localStorage data doesn't contain sensitive info
- [ ] Validate session expiry works correctly

## 🎮 RPG Game Testing

### Core Game Mechanics

- **Character Progression**: XP gain, leveling, stat increases
- **Combat System**: Turn-based battles, damage calculation
- **Inventory Management**: Item collection, equipment, shop system
- **Quest System**: Story progression, completion tracking
- **Location System**: Area exploration, encounter rates

### Game Balance Testing

```javascript
// Example: Equipment balance validation
test('Equipment prices scale correctly', () => {
    const weapons = gameData.equipment.weapons;
    weapons.forEach(weapon => {
        expect(weapon.price).toBeGreaterThan(weapon.damage * 10);
        expect(weapon.price).toBeLessThan(weapon.damage * 50);
    });
});
```

## 📱 Responsive Design Testing

### Tested Viewports

- **Desktop**: 1920x1080, 1366x768, 1024x768
- **Tablet**: iPad, iPad Pro, Surface
- **Mobile**: iPhone SE, iPhone 12, iPhone 12 Pro Max, Pixel 5

### Responsive Test Coverage

- Navigation menu collapse/expand
- Game interface scaling
- Image gallery responsiveness
- Touch interactions on mobile devices

## 🔍 Debugging Tests

### Common Issues & Solutions

**Unit Tests Failing**

```bash
# Run specific test file
npm test -- gameData.test.js

# Run with verbose output
npm test -- --verbose

# Debug mode
npm test -- --detectOpenHandles
```

**E2E Tests Timing Out**

```bash
# Run with headed browser (visible)
npx playwright test --headed

# Debug specific test
npx playwright test auth.spec.js --debug

# Generate trace files
npx playwright test --trace on
```

**Performance Issues**

```bash
# Run Lighthouse locally
npm run lighthouse

# Check bundle size
npm run analyze
```

## 📊 Coverage Reports

### Viewing Coverage

After running `npm run test:coverage`:

- Open `coverage/lcov-report/index.html` in browser
- Check coverage badge in README
- Review uncovered lines in terminal output

### Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## 🚦 Test Status Badges

Current test status is displayed in the main README with live badges showing:

- Build status (passing/failing)
- Test coverage percentage
- Security audit status
- Performance score

## 🔄 Adding New Tests

### Unit Test Template

```javascript
describe('New Feature', () => {
    let mockDataManager;

    beforeEach(() => {
        mockDataManager = createMockDataManager();
    });

    test('should handle new functionality', () => {
        // Arrange
        const input = 'test data';

        // Act
        const result = mockDataManager.newMethod(input);

        // Assert
        expect(result).toBe('expected output');
    });
});
```

### E2E Test Template

```javascript
test('New user workflow', async ({ page }) => {
    await page.goto('/');

    // Test new functionality
    await page.click('[data-testid="new-feature"]');
    await expect(page.locator('.result')).toBeVisible();
});
```

## 🎯 Test Maintenance

### Regular Maintenance Tasks

- [ ] Update test data when game content changes
- [ ] Add tests for new features
- [ ] Review and update browser support matrix
- [ ] Monitor performance benchmarks
- [ ] Update security audit thresholds

### Monthly Reviews

- [ ] Check for outdated dependencies
- [ ] Review test execution times
- [ ] Update documentation
- [ ] Verify CI/CD pipeline efficiency

---

## 🤝 Contributing to Tests

When adding new features to Silas's website:

1. **Write unit tests first** for core logic
2. **Add E2E tests** for user-facing features
3. **Update documentation** as needed
4. **Verify all browsers** still work correctly
5. **Check performance impact** with Lighthouse

**Remember**: Tests help ensure Silas's website always works perfectly for
visitors! 🌟
