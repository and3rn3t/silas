import { test, expect } from '@playwright/test';

test.describe('Authentication and Admin Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should show login form', async ({ page }) => {
        // Navigate to login section via admin nav link
        await page.click('#admin-nav-link');

        // Check login form elements
        const passwordInput = page.locator('#login-password');
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute('type', 'password');

        const loginBtn = page.locator('#login-btn');
        await expect(loginBtn).toBeVisible();
        await expect(loginBtn).toContainText('Login');
    });

    test('should handle incorrect password', async ({ page }) => {
        // Navigate to login section
        await page.click('#admin-nav-link');

        // Enter incorrect password
        await page.fill('#login-password', 'wrongpassword');
        await page.click('#login-btn');

        // Check error message
        const errorMsg = page.locator('#login-error');
        await expect(errorMsg).toContainText('Incorrect password');

        // Admin nav should still be visible (as "Login" button)
        const adminNav = page.locator('#admin-nav-link');
        await expect(adminNav).toBeVisible();
        await expect(adminNav).toContainText('Login');
    });

    test('should handle correct password login', async ({ page }) => {
        // Navigate to login section
        await page.click('#admin-nav-link');

        // Enter correct password
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Should redirect to admin section
        await expect(page.locator('#admin')).toHaveClass(/active/);

        // Admin nav should be visible and show "Edit"
        const adminNav = page.locator('#admin-nav-link');
        await expect(adminNav).toBeVisible();
        await expect(adminNav).toContainText('Edit');
    });

    test('should display admin interface after login', async ({ page }) => {
        // Login first
        await page.click('#admin-nav-link');
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Check admin interface elements
        const logoutBtn = page.locator('#logout-btn');
        await expect(logoutBtn).toBeVisible();

        // Check bio editor
        const bioEditor = page.locator('#bio-editor');
        await expect(bioEditor).toBeVisible();

        // Check interests editor
        const interestsEditor = page.locator('#interests-editor');
        await expect(interestsEditor).toBeVisible();

        // Check add interest input
        const newInterestInput = page.locator('#new-interest');
        await expect(newInterestInput).toBeVisible();
    });

    test('should handle logout', async ({ page }) => {
        // Login first
        await page.click('#admin-nav-link');
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Handle the logout confirmation dialog
        page.on('dialog', dialog => dialog.accept());

        // Click logout
        await page.click('#logout-btn');

        // Should redirect to home
        await expect(page.locator('#home')).toHaveClass(/active/);

        // Admin nav should still be visible (as "Login" button)
        const adminNav = page.locator('#admin-nav-link');
        await expect(adminNav).toBeVisible();
        await expect(adminNav).toContainText('Login');
    });

    test('should edit bio', async ({ page }) => {
        // Login
        await page.click('#admin-nav-link');
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Wait for admin section to be visible
        await expect(page.locator('#admin')).toHaveClass(/active/);

        // Edit bio
        const testBio = 'This is a test bio for E2E testing';
        await page.fill('#bio-editor', testBio);
        await page.click('#save-bio-btn');

        // Navigate to home section to verify change
        await page.click('[data-section="home"]');

        // Check that bio was updated
        const bioDisplay = page.locator('#bio-display');
        await expect(bioDisplay).toContainText(testBio);
    });

    test('should add new interest', async ({ page }) => {
        // Login
        await page.click('#admin-nav-link');
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Wait for admin section to be visible
        await expect(page.locator('#admin')).toHaveClass(/active/);

        // Add new interest
        const newInterest = 'E2E Testing';
        await page.fill('#new-interest', newInterest);
        await page.click('#add-interest-btn');

        // Check that interest was added to editor (use filter to find specific interest)
        const interestTag = page.locator('#interests-editor .interest-tag-editable').filter({ hasText: newInterest });
        await expect(interestTag).toBeVisible();

        // Navigate to home section to verify
        await page.click('[data-section="home"]');

        // Check that interest appears in display
        const displayedInterest = page.locator('.interests-container .interest-tag').filter({ hasText: newInterest });
        await expect(displayedInterest).toBeVisible();
    });

    test('should remove interest', async ({ page }) => {
        // Login
        await page.click('#admin-nav-link');
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Wait for admin section to be visible
        await expect(page.locator('#admin')).toHaveClass(/active/);

        // Get initial interest count
        const initialInterests = await page.locator('#interests-editor .interest-tag-editable').count();

        if (initialInterests > 0) {
            // Remove first interest - use locator.first().click() not click().first()
            await page.locator('#interests-editor .interest-tag-editable button').first().click();

            // Wait a moment for the UI to update
            await page.waitForTimeout(100);

            // Check that interest count decreased
            const finalInterests = await page.locator('#interests-editor .interest-tag-editable').count();
            expect(finalInterests).toBe(initialInterests - 1);
        }
    });

    test('should maintain authentication state on page refresh', async ({ page }) => {
        // Login
        await page.click('#admin-nav-link');
        await page.fill('#login-password', 'silas123');
        await page.click('#login-btn');

        // Verify logged in and admin nav shows "Edit"
        const adminNav = page.locator('#admin-nav-link');
        await expect(adminNav).toBeVisible();
        await expect(adminNav).toContainText('Edit');

        // Refresh page
        await page.reload();

        // Authentication should persist (session storage)
        await expect(adminNav).toBeVisible();
        await expect(adminNav).toContainText('Edit');
    });

    test('should prevent direct admin access without login', async ({ page }) => {
        // Admin nav should be visible as "Login" button
        const adminNav = page.locator('#admin-nav-link');
        await expect(adminNav).toBeVisible();
        await expect(adminNav).toContainText('Login');

        // Try to navigate to admin section directly via clicking nav
        await page.click('#admin-nav-link');

        // Should redirect to login section instead
        await expect(page.locator('#login')).toHaveClass(/active/);
        await expect(page.locator('#admin')).not.toHaveClass(/active/);

        // Admin nav should still show "Login"
        await expect(adminNav).toContainText('Login');
    });
});
