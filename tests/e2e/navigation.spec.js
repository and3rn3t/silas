import { test, expect } from '@playwright/test';

test.describe('Silas Anderson Website - Basic Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Silas Anderson/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Silas Anderson');
    
    // Check navigation is present
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    // Test navigation to About section
    await page.click('[data-section="about"]');
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toHaveClass(/active/);
    
    // Test navigation to Gallery section
    await page.click('[data-section="gallery"]');
    const gallerySection = page.locator('#gallery');
    await expect(gallerySection).toHaveClass(/active/);
    
    // Test navigation to Stories section
    await page.click('[data-section="stories"]');
    const storiesSection = page.locator('#stories');
    await expect(storiesSection).toHaveClass(/active/);
    
    // Test navigation to Game section
    await page.click('[data-section="game"]');
    const gameSection = page.locator('#game');
    await expect(gameSection).toHaveClass(/active/);
  });

  test('should display bio and interests', async ({ page }) => {
    // Navigate to About section
    await page.click('[data-section="about"]');
    
    // Check bio is displayed
    const bioContainer = page.locator('.bio-container');
    await expect(bioContainer).toBeVisible();
    
    // Check interests are displayed
    const interestsContainer = page.locator('.interests-container');
    await expect(interestsContainer).toBeVisible();
    
    // Check for interest tags
    const interestTags = page.locator('.interest-tag');
    await expect(interestTags.first()).toBeVisible();
  });

  test('should show login section', async ({ page }) => {
    // Navigate to Login section
    await page.click('[data-section="login"]');
    
    // Check login form is present
    const loginForm = page.locator('.login-form');
    await expect(loginForm).toBeVisible();
    
    // Check password input
    const passwordInput = page.locator('#login-password');
    await expect(passwordInput).toBeVisible();
    
    // Check login button
    const loginButton = page.locator('#login-btn');
    await expect(loginButton).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that navigation is still functional
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check that content is readable
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigation should still work
    await page.click('[data-section="game"]');
    const gameSection = page.locator('#game');
    await expect(gameSection).toHaveClass(/active/);
  });
});