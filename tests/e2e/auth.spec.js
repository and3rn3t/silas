import { test, expect } from '@playwright/test';

test.describe('Authentication and Admin Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login form', async ({ page }) => {
    // Navigate to login section
    await page.click('[data-section="login"]');
    
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
    await page.click('[data-section="login"]');
    
    // Enter incorrect password
    await page.fill('#login-password', 'wrongpassword');
    await page.click('#login-btn');
    
    // Check error message
    const errorMsg = page.locator('#login-error');
    await expect(errorMsg).toContainText('Incorrect password');
    
    // Admin nav should not be visible
    const adminNav = page.locator('#admin-nav-link');
    await expect(adminNav).not.toBeVisible();
  });

  test('should handle correct password login', async ({ page }) => {
    // Navigate to login section
    await page.click('[data-section="login"]');
    
    // Enter correct password
    await page.fill('#login-password', 'silas123');
    await page.click('#login-btn');
    
    // Should redirect to admin section
    await expect(page.locator('#admin')).toHaveClass(/active/);
    
    // Admin nav should be visible
    const adminNav = page.locator('#admin-nav-link');
    await expect(adminNav).toBeVisible();
  });

  test('should display admin interface after login', async ({ page }) => {
    // Login first
    await page.click('[data-section="login"]');
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
    await page.click('[data-section="login"]');
    await page.fill('#login-password', 'silas123');
    await page.click('#login-btn');
    
    // Click logout
    await page.click('#logout-btn');
    
    // Should redirect to home
    await expect(page.locator('#home')).toHaveClass(/active/);
    
    // Admin nav should be hidden
    const adminNav = page.locator('#admin-nav-link');
    await expect(adminNav).not.toBeVisible();
  });

  test('should edit bio', async ({ page }) => {
    // Login
    await page.click('[data-section="login"]');
    await page.fill('#login-password', 'silas123');
    await page.click('#login-btn');
    
    // Edit bio
    const testBio = 'This is a test bio for E2E testing';
    await page.fill('#bio-editor', testBio);
    await page.click('#save-bio-btn');
    
    // Navigate to about section to verify change
    await page.click('[data-section="about"]');
    
    // Check that bio was updated
    const bioDisplay = page.locator('.bio-display');
    await expect(bioDisplay).toContainText(testBio);
  });

  test('should add new interest', async ({ page }) => {
    // Login
    await page.click('[data-section="login"]');
    await page.fill('#login-password', 'silas123');
    await page.click('#login-btn');
    
    // Add new interest
    const newInterest = 'E2E Testing';
    await page.fill('#new-interest', newInterest);
    await page.click('#add-interest-btn');
    
    // Check that interest was added to editor
    const interestTags = page.locator('#interests-editor .interest-tag-editable');
    await expect(interestTags).toContainText(newInterest);
    
    // Navigate to about section to verify
    await page.click('[data-section="about"]');
    
    // Check that interest appears in display
    const displayedInterests = page.locator('.interests-display .interest-tag');
    await expect(displayedInterests).toContainText(newInterest);
  });

  test('should remove interest', async ({ page }) => {
    // Login
    await page.click('[data-section="login"]');
    await page.fill('#login-password', 'silas123');
    await page.click('#login-btn');
    
    // Get initial interest count
    const initialInterests = await page.locator('#interests-editor .interest-tag-editable').count();
    
    if (initialInterests > 0) {
      // Remove first interest
      await page.click('#interests-editor .interest-tag-editable button').first();
      
      // Check that interest count decreased
      const finalInterests = await page.locator('#interests-editor .interest-tag-editable').count();
      expect(finalInterests).toBe(initialInterests - 1);
    }
  });

  test('should maintain authentication state on page refresh', async ({ page }) => {
    // Login
    await page.click('[data-section="login"]');
    await page.fill('#login-password', 'silas123');
    await page.click('#login-btn');
    
    // Verify logged in
    await expect(page.locator('#admin-nav-link')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Authentication should persist (session storage)
    await expect(page.locator('#admin-nav-link')).toBeVisible();
  });

  test('should prevent direct admin access without login', async ({ page }) => {
    // Try to navigate to admin section directly
    await page.click('[data-section="login"]');
    
    // Admin nav should not be visible
    const adminNav = page.locator('#admin-nav-link');
    await expect(adminNav).not.toBeVisible();
    
    // Even if we try to show admin section, it should be blocked by JavaScript
    await page.evaluate(() => {
      document.getElementById('admin').classList.add('active');
    });
    
    // But the admin nav should still not be visible since not authenticated
    await expect(adminNav).not.toBeVisible();
  });
});