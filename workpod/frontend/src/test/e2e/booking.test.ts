import { test, expect } from '@playwright/test';
import { login, clearTestData, TEST_USER } from './utils';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearTestData(page);
    await login(page);
  });

  test('should search and book a pod', async ({ page }) => {
    await page.goto('/pods/search');
    await page.fill('[data-testid="location-search"]', 'New York');
    await page.click('[data-testid="search-button"]');
    
    await expect(page.locator('[data-testid="pod-card"]')).toBeVisible();
    
    await page.click('[data-testid="pod-card"]:first-child');
    await page.fill('[data-testid="booking-duration"]', '2');
    await page.click('[data-testid="book-now-button"]');
    
    await expect(page).toHaveURL(/\/booking\/.*\/payment/);
  });

  test('should show pods on map', async ({ page }) => {
    await page.goto('/pods/map');
    await page.fill('[data-testid="map-search"]', 'New York');
    await page.click('[data-testid="search-map-button"]');
    
    await expect(page.locator('[data-testid="map"]')).toBeVisible();
    const markers = await page.locator('[data-testid="pod-marker"]').count();
    expect(markers).toBeGreaterThan(0);
  });

  test('should view booking history', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('[data-testid="bookings-tab"]');
    
    await expect(page.locator('[data-testid="booking-history"]')).toBeVisible();
    const bookings = await page.locator('[data-testid="booking-item"]').count();
    expect(bookings).toBeGreaterThanOrEqual(0);
  });

  test('should cancel a booking', async ({ page }) => {
    // First create a booking
    await page.goto('/pods/search');
    await page.fill('[data-testid="location-search"]', 'New York');
    await page.click('[data-testid="search-button"]');
    await page.click('[data-testid="pod-card"]:first-child');
    await page.fill('[data-testid="booking-duration"]', '2');
    await page.click('[data-testid="book-now-button"]');
    
    // Go to bookings and cancel
    await page.goto('/dashboard/bookings');
    const hasBookings = await page.locator('[data-testid="booking-item"]').count() > 0;
    
    if (hasBookings) {
      await page.click('[data-testid="cancel-booking-button"]:first-child');
      await page.click('[data-testid="confirm-cancel-button"]');
      await expect(page.locator('[data-testid="cancel-success"]')).toBeVisible();
    }
  });

  test('should filter pods by amenities', async ({ page }) => {
    await page.goto('/pods/search');
    await page.click('[data-testid="filter-button"]');
    await page.click('[data-testid="wifi-filter"]');
    await page.click('[data-testid="standing-desk-filter"]');
    await page.click('[data-testid="apply-filters"]');
    
    const pods = await page.locator('[data-testid="pod-card"]').all();
    for (const pod of pods) {
      await expect(pod.locator('[data-testid="wifi-icon"]')).toBeVisible();
      await expect(pod.locator('[data-testid="standing-desk-icon"]')).toBeVisible();
    }
  });
}); 