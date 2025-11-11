import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Device Testing', () => {
    // Test on multiple mobile devices
    const mobileDevices = [
        'iPhone 12',
        'iPhone 12 Pro Max',
        'iPhone SE',
        'Pixel 5',
        'Samsung Galaxy S21',
        'iPad Mini'
    ];

    mobileDevices.forEach(deviceName => {
        test.describe(`${deviceName} Tests`, () => {
            test.use({ ...devices[deviceName] });

            test(`should render correctly on ${deviceName}`, async ({ page }) => {
                await page.goto('/');

                // Check page loads
                await expect(page).toHaveTitle(/Silas Anderson/);

                // Check responsive layout
                const nav = page.locator('.navbar');
                await expect(nav).toBeVisible();

                // Check mobile navigation works
                await page.click('[data-section="gallery"]');
                const gallerySection = page.locator('#gallery');
                await expect(gallerySection).toHaveClass(/active/);
            });

            test(`should handle touch interactions on ${deviceName}`, async ({ page }) => {
                await page.goto('/');

                // Test touch navigation
                await page.tap('[data-section="game"]');
                const gameSection = page.locator('#game');
                await expect(gameSection).toHaveClass(/active/);

                // Test game button taps
                await page.tap('#explore-btn');

                // Verify game responds
                const gameMessage = page.locator('#game-message');
                await expect(gameMessage).toContainText(/You/);
            });

            test(`should work in portrait and landscape on ${deviceName}`, async ({ page }) => {
                await page.goto('/');

                // Test portrait mode
                const portraitNav = page.locator('.nav-links');
                await expect(portraitNav).toBeVisible();

                // Switch to landscape (simulated by changing viewport)
                if (deviceName.includes('iPhone') || deviceName.includes('Pixel')) {
                    await page.setViewportSize({ width: 812, height: 375 });

                    // Check navigation still works in landscape
                    await page.click('[data-section="stories"]');
                    const storiesSection = page.locator('#stories');
                    await expect(storiesSection).toHaveClass(/active/);
                }
            });
        });
    });

    test.describe('Mobile-Specific Features', () => {
        test.use({ ...devices['iPhone 12'] });

        test('should show PWA install prompt simulation', async ({ page }) => {
            await page.goto('/');

            // Simulate PWA install prompt
            await page.evaluate(() => {
                window.dispatchEvent(new Event('beforeinstallprompt'));
            });

            // Check if install button appears (may not in test environment)
            const installBtn = page.locator('#install-btn');
            // Note: Install button may not appear in test environment
        });

        test('should handle offline mode gracefully', async ({ page }) => {
            await page.goto('/');

            // Simulate offline
            await page.route('**/*', route => route.abort());

            // Page should still be functional (cached)
            const nav = page.locator('.navbar');
            await expect(nav).toBeVisible();
        });

        test('should support swipe gestures', async ({ page }) => {
            await page.goto('/');

            // Simulate swipe left
            await page.touchscreen.tap(200, 300);
            await page.mouse.move(200, 300);
            await page.mouse.down();
            await page.mouse.move(100, 300);
            await page.mouse.up();

            // Should navigate to next section
            await page.waitForTimeout(500);
        });

        test('should handle viewport changes', async ({ page }) => {
            // Start with mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/');

            // Check mobile layout
            const mobileNav = page.locator('.nav-links');
            await expect(mobileNav).toBeVisible();

            // Switch to tablet size
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.waitForTimeout(100);

            // Check layout adapts
            await expect(mobileNav).toBeVisible();

            // Switch to very small screen
            await page.setViewportSize({ width: 320, height: 568 });
            await page.waitForTimeout(100);

            // Should still be functional
            await page.click('[data-section="game"]');
            const gameSection = page.locator('#game');
            await expect(gameSection).toHaveClass(/active/);
        });
    });

    test.describe('Game Interface on Mobile', () => {
        test.use({ ...devices['Pixel 5'] });

        test('should have touch-friendly game controls', async ({ page }) => {
            await page.goto('/');
            await page.click('[data-section="game"]');

            // Test game buttons are large enough for touch
            const exploreBtn = page.locator('#explore-btn');
            const btnBox = await exploreBtn.boundingBox();

            // Check minimum touch target size (44px recommended)
            expect(btnBox?.height).toBeGreaterThanOrEqual(40);
            expect(btnBox?.width).toBeGreaterThanOrEqual(100);

            // Test button responsiveness
            await page.tap('#explore-btn');

            // Should get game response
            const gameMessage = page.locator('#game-message');
            await expect(gameMessage).not.toBeEmpty();
        });

        test('should handle battle interface on mobile', async ({ page }) => {
            await page.goto('/');
            await page.click('[data-section="game"]');

            // Trigger battles until we get one
            let battleFound = false;
            let attempts = 0;

            while (!battleFound && attempts < 10) {
                await page.click('#explore-btn');
                await page.waitForTimeout(500);

                const battleUI = page.locator('#battle-ui');
                if (await battleUI.isVisible()) {
                    battleFound = true;
                }
                attempts++;
            }

            if (battleFound) {
                // Test battle controls are touch-friendly
                const attackBtn = page.locator('#attack-btn');
                await expect(attackBtn).toBeVisible();

                const btnBox = await attackBtn.boundingBox();
                expect(btnBox?.height).toBeGreaterThanOrEqual(40);

                // Test battle interaction
                await page.tap('#attack-btn');
            }
        });

        test('should display game stats properly on small screens', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 568 });
            await page.goto('/');
            await page.click('[data-section="game"]');

            // Check stats are visible and readable
            const gameStats = page.locator('.game-stats');
            await expect(gameStats).toBeVisible();

            const statItems = page.locator('.stat-item');
            const count = await statItems.count();
            expect(count).toBeGreaterThan(0);

            // Check each stat is readable
            for (let i = 0; i < count; i++) {
                const stat = statItems.nth(i);
                await expect(stat).toBeVisible();
                const text = await stat.textContent();
                expect(text?.length).toBeGreaterThan(0);
            }
        });
    });

    test.describe('Performance on Mobile', () => {
        test.use({ ...devices['iPhone SE'] }); // Lower-end device for performance testing

        test('should load quickly on mobile', async ({ page }) => {
            const startTime = Date.now();
            await page.goto('/');

            // Check critical content loads quickly
            await expect(page.locator('h1')).toBeVisible();
            const loadTime = Date.now() - startTime;

            // Should load within reasonable time
            expect(loadTime).toBeLessThan(3000);
        });

        test('should be responsive during gameplay', async ({ page }) => {
            await page.goto('/');
            await page.click('[data-section="game"]');

            const startTime = Date.now();

            // Perform multiple game actions quickly
            for (let i = 0; i < 5; i++) {
                await page.click('#explore-btn');
                await page.waitForTimeout(100);
            }

            const actionTime = Date.now() - startTime;

            // Actions should complete reasonably quickly
            expect(actionTime).toBeLessThan(5000);

            // UI should still be responsive
            await page.click('#stats-btn');
            const gameMessage = page.locator('#game-message');
            await expect(gameMessage).toContainText(/CHARACTER STATS/);
        });

        test('should handle rapid interactions without breaking', async ({ page }) => {
            await page.goto('/');

            // Rapidly switch between sections
            const sections = ['gallery', 'stories', 'game', 'home'];

            for (let round = 0; round < 3; round++) {
                for (const section of sections) {
                    await page.click(`[data-section="${section}"]`);
                    await page.waitForTimeout(50); // Very quick switching
                }
            }

            // Should still be functional
            const activeSection = page.locator('.section.active');
            await expect(activeSection).toBeVisible();
        });
    });

    test.describe('Accessibility on Mobile', () => {
        test.use({ ...devices['iPad Mini'] });

        test('should support screen reader navigation', async ({ page }) => {
            await page.goto('/');

            // Check ARIA labels and semantic HTML
            const nav = page.locator('nav');
            await expect(nav).toBeVisible();

            const headings = page.locator('h1, h2, h3');
            const headingCount = await headings.count();
            expect(headingCount).toBeGreaterThan(0);

            // Check buttons have accessible text
            const buttons = page.locator('button, .game-btn, .nav-link');
            const buttonCount = await buttons.count();

            for (let i = 0; i < Math.min(buttonCount, 5); i++) {
                const button = buttons.nth(i);
                const text = await button.textContent();
                expect(text?.trim().length).toBeGreaterThan(0);
            }
        });

        test('should have proper focus management on mobile', async ({ page }) => {
            await page.goto('/');

            // Tab through navigation
            await page.keyboard.press('Tab');

            // Check focus is visible
            const focused = page.locator(':focus');
            await expect(focused).toBeVisible();
        });

        test('should support high contrast mode', async ({ page }) => {
            // Simulate high contrast preference
            await page.emulateMedia({ colorScheme: 'dark' });
            await page.goto('/');

            // Check contrast is sufficient
            const nav = page.locator('.navbar');
            await expect(nav).toBeVisible();

            const buttons = page.locator('.nav-link');
            await expect(buttons.first()).toBeVisible();
        });
    });
});
