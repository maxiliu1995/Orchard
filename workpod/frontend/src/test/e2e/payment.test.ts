import { test, expect } from '@playwright/test';
import { login, createBooking, fillStripeCard, clearTestData, CARD_NUMBERS } from './utils';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearTestData(page);
    await login(page);
    await createBooking(page);
  });

  test('should process Stripe payment', async ({ page }) => {
    await page.click('[data-testid="stripe-payment-option"]');
    await fillStripeCard(page, CARD_NUMBERS.valid);
    await page.click('[data-testid="pay-button"]');
    
    await expect(page).toHaveURL(/\/booking\/.*\/confirmation/);
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
  });

  test('should process PayPal payment', async ({ page }) => {
    await page.click('[data-testid="paypal-payment-option"]');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('[data-testid="paypal-button"]')
    ]);
    
    await popup.waitForLoadState();
    await popup.click('[data-testid="paypal-pay-button"]');
    
    await expect(page).toHaveURL(/\/booking\/.*\/confirmation/);
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
  });

  test('should show payment history', async ({ page }) => {
    await page.goto('/dashboard/payments');
    await expect(page.locator('[data-testid="payment-history"]')).toBeVisible();
    
    const transactions = await page.locator('[data-testid="transaction-item"]').count();
    expect(transactions).toBeGreaterThan(0);
  });

  test('should handle payment failure gracefully', async ({ page }) => {
    await page.click('[data-testid="stripe-payment-option"]');
    await fillStripeCard(page, CARD_NUMBERS.declined);
    await page.click('[data-testid="pay-button"]');
    
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
  });

  test('should handle insufficient funds', async ({ page }) => {
    await page.click('[data-testid="stripe-payment-option"]');
    await fillStripeCard(page, CARD_NUMBERS.insufficient_funds);
    await page.click('[data-testid="pay-button"]');
    
    await expect(page.locator('[data-testid="payment-error"]')).toContainText('insufficient funds');
  });
}); 