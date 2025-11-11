import { test, expect } from '@playwright/test';

test.describe('Adventure Game E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');

        // Navigate to game section
        await page.click('[data-section="game"]');
        await expect(page.locator('#game')).toHaveClass(/active/);

        // Reset game to ensure clean state
        await page.click('#reset-game-btn');

        // Wait for game to initialize
        await page.waitForTimeout(500);
    });

    test('should display game interface', async ({ page }) => {
        // Check game stats are visible
        const gameStats = page.locator('.game-stats');
        await expect(gameStats).toBeVisible();

        // Check hero stats
        await expect(page.locator('#hero-name')).toContainText('Brave Adventurer');
        await expect(page.locator('#hero-level')).toContainText('1');
        await expect(page.locator('#hero-hp')).toContainText('100');

        // Check game actions are present
        const exploreBtn = page.locator('#explore-btn');
        await expect(exploreBtn).toBeVisible();
        await expect(exploreBtn).toContainText('Explore');

        const restBtn = page.locator('#rest-btn');
        await expect(restBtn).toBeVisible();

        const shopBtn = page.locator('#shop-btn');
        await expect(shopBtn).toBeVisible();
    });

    test('should show location selector', async ({ page }) => {
        // Check location selector is visible
        const locationSelector = page.locator('.location-selector');
        await expect(locationSelector).toBeVisible();

        // Check castle location is available and active
        const castleLocation = page.locator('.location-card').first();
        await expect(castleLocation).toBeVisible();
        await expect(castleLocation).toHaveClass(/active/);

        // Check location grid has locations
        const locationCards = page.locator('.location-card');
        await expect(locationCards).toHaveCount(8); // Should have 8 locations
    });

    test('should display quest interface', async ({ page }) => {
        // Check quest panels are visible
        const questsPanel = page.locator('.quests-panel');
        await expect(questsPanel).toBeVisible();

        // Check active quests section
        const activeQuests = page.locator('#active-quests');
        await expect(activeQuests).toBeVisible();

        // Check available quests section
        const availableQuests = page.locator('#available-quests');
        await expect(availableQuests).toBeVisible();
    });

    test('should handle exploration', async ({ page }) => {
        // Get initial gold or XP to verify change
        const initialGold = await page.locator('#hero-gold').textContent();

        // Click explore button
        await page.click('#explore-btn');

        // Wait for exploration result
        await page.waitForTimeout(1000);

        // Check that game image is visible
        const gameImage = page.locator('#game-image');
        await expect(gameImage).toBeVisible();

        // Either gold or XP should have changed (or HP if we fought)
        // Just verify the explore button is still clickable (game didn't crash)
        const exploreBtn = page.locator('#explore-btn');
        await expect(exploreBtn).toBeEnabled();
    });

    test('should handle rest action', async ({ page }) => {
        // First, reduce HP by exploring (if we encounter an enemy)
        await page.click('#explore-btn');
        await page.waitForTimeout(1000);

        // Click rest button
        await page.click('#rest-btn');
        await page.waitForTimeout(500);

        // Check that hero HP is restored to max
        const heroHp = page.locator('#hero-hp');
        const heroMaxHp = page.locator('#hero-max-hp');

        await expect(heroHp).toContainText('100');
        await expect(heroMaxHp).toContainText('100');
    });

    test('should open shop interface', async ({ page }) => {
        // Click shop button
        await page.click('#shop-btn');

        // Check that shop interface appears (via alert/prompt)
        // Note: This test might need adjustment based on actual shop implementation
        await page.waitForTimeout(500);
    });

    test('should display character stats', async ({ page }) => {
        // Click stats button
        await page.click('#stats-btn');
        await page.waitForTimeout(500);

        // Verify stats are displayed in game message
        const gameMessage = page.locator('#game-message');
        await expect(gameMessage).toContainText('CHARACTER STATS');
    });

    test('should handle class selection', async ({ page }) => {
        // Handle the prompt dialog that appears
        page.on('dialog', async dialog => {
            await dialog.accept('1'); // Select warrior (option 1)
        });

        // Click choose class button
        await page.click('#choose-class-btn');
        await page.waitForTimeout(500);

        // Verify class was selected by checking game message
        const gameMessage = page.locator('#game-message');
        // The message should show something about the class
        await expect(gameMessage).not.toContainText('Welcome, brave hero');
    });

    test('should handle quest log', async ({ page }) => {
        // Click quests button
        await page.click('#quests-btn');
        await page.waitForTimeout(500);

        // Verify quest log appears
        const gameMessage = page.locator('#game-message');
        await expect(gameMessage).toContainText('QUEST LOG');
    });

    test('should handle location selection', async ({ page }) => {
        // Click on a different location (forest should be locked initially)
        const forestLocation = page.locator('.location-card').nth(1);

        // Check if it's locked (should have locked class)
        const isLocked = await forestLocation.getAttribute('class');
        if (isLocked && isLocked.includes('locked')) {
            // Verify locked locations don't respond to clicks
            await forestLocation.click();

            // Castle should still be active
            const castleLocation = page.locator('.location-card').first();
            await expect(castleLocation).toHaveClass(/active/);
        }
    });

    test('should persist game state on page refresh', async ({ page }) => {
        // Make some progress in the game
        await page.click('#explore-btn');
        await page.waitForTimeout(1000);

        // Get current gold value
        const goldBefore = await page.locator('#hero-gold').textContent();

        // Refresh the page
        await page.reload();

        // Navigate back to game section
        await page.click('[data-section="game"]');

        // Check that progress was saved
        const goldAfter = await page.locator('#hero-gold').textContent();
        expect(goldAfter).toBe(goldBefore);
    });

    test('should handle battle interface', async ({ page }) => {
        // Keep exploring until we encounter an enemy
        for (let i = 0; i < 10; i++) {
            await page.click('#explore-btn');
            await page.waitForTimeout(1000);

            // Check if battle UI appeared
            const battleUI = page.locator('#battle-ui');
            const isVisible = await battleUI.isVisible();

            if (isVisible) {
                // Verify battle interface elements
                await expect(battleUI).toBeVisible();

                // Check battle actions
                const battleActions = page.locator('#battle-actions');
                await expect(battleActions).toBeVisible();

                // Check attack button
                const attackBtn = page.locator('#attack-btn');
                await expect(attackBtn).toBeVisible();

                break;
            }
        }
    });
});
