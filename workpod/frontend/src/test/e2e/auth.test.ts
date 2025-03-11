import { test, expect } from '@playwright/test';
import { clearTestData, TEST_USER } from './utils';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearTestData(page);
    await page.goto('/auth/login');
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('[data-testid="email"]', TEST_USER.email);
    await page.fill('[data-testid="password"]', TEST_USER.password);
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email"]', TEST_USER.email);
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should register new user', async ({ page }) => {
    await page.click('[data-testid="register-link"]');
    await expect(page).toHaveURL('/auth/register');
    
    const randomEmail = `test${Date.now()}@example.com`;
    await page.fill('[data-testid="email"]', randomEmail);
    await page.fill('[data-testid="password"]', 'Password123!');
    await page.fill('[data-testid="confirm-password"]', 'Password123!');
    await page.fill('[data-testid="name"]', 'Test User');
    await page.click('[data-testid="register-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should request password reset', async ({ page }) => {
    await page.click('[data-testid="forgot-password-link"]');
    await expect(page).toHaveURL('/auth/forgot-password');
    
    await page.fill('[data-testid="email"]', TEST_USER.email);
    await page.click('[data-testid="reset-button"]');
    
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('should validate registration form', async ({ page }) => {
    await page.click('[data-testid="register-link"]');
    
    // Try to submit empty form
    await page.click('[data-testid="register-button"]');
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    
    // Try weak password
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', '123');
    await page.fill('[data-testid="confirm-password"]', '123');
    await page.click('[data-testid="register-button"]');
    
    await expect(page.locator('[data-testid="password-error"]')).toContainText('password is too weak');
  });

  test('should logout', async ({ page }) => {
    // Login first
    await page.fill('[data-testid="email"]', TEST_USER.email);
    await page.fill('[data-testid="password"]', TEST_USER.password);
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
    
    // Then logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });
}); 