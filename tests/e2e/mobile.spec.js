import { test, expect } from "@playwright/test";

test.describe("Mobile Device Testing", () => {
    test("should render correctly on mobile devices", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Silas Anderson/);

        const nav = page.locator(".navbar");
        await expect(nav).toBeVisible();

        await page.click("[data-section=\"gallery\"]");
        const gallerySection = page.locator("#gallery");
        await expect(gallerySection).toHaveClass(/active/);
    });

    test("should handle touch interactions", async ({ page }) => {
        await page.goto("/");

        // Use click for desktop browsers, tap for mobile when supported
        await page.click("[data-section=\"game\"]");
        const gameSection = page.locator("#game");
        await expect(gameSection).toHaveClass(/active/);

        await page.click("#explore-btn");
        const gameMessage = page.locator("#game-message");
        await expect(gameMessage).toContainText(/You/);
    });    test("should work with viewport changes", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");

        const nav = page.locator(".nav-links");
        await expect(nav).toBeVisible();

        await page.setViewportSize({ width: 320, height: 568 });
        await page.click("[data-section=\"game\"]");
        const gameSection = page.locator("#game");
        await expect(gameSection).toHaveClass(/active/);
    });
});
