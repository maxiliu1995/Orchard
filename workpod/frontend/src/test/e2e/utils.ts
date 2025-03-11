import { Page, expect } from '@playwright/test';

export async function login(page: Page, email = 'test@example.com', password = 'password123') {
  await page.goto('/auth/login');
  await page.fill('[data-testid="email"]', email);
  await page.fill('[data-testid="password"]', password);
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
}

export async function createBooking(page: Page) {
  await page.goto('/pods/search');
  await page.fill('[data-testid="location-search"]', 'New York');
  await page.click('[data-testid="search-button"]');
  await page.waitForSelector('[data-testid="pod-card"]');
  await page.click('[data-testid="pod-card"]:first-child');
  await page.fill('[data-testid="booking-duration"]', '2');
  await page.click('[data-testid="book-now-button"]');
  await expect(page).toHaveURL(/\/booking\/.*\/payment/);
}

export async function fillStripeCard(page: Page, cardNumber = '4242424242424242') {
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
  await stripeFrame.locator('[placeholder="Card number"]').fill(cardNumber);
  await stripeFrame.locator('[placeholder="MM / YY"]').fill('1230');
  await stripeFrame.locator('[placeholder="CVC"]').fill('123');
}

export async function clearTestData(page: Page) {
  // Clear local storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Clear cookies
  await page.context().clearCookies();
}

export const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

export const CARD_NUMBERS = {
  valid: '4242424242424242',
  declined: '4000000000000002',
  insufficient_funds: '4000000000009995',
  expired: '4000000000000069'
}; 