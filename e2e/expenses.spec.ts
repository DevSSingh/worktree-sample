import { test, expect } from '@playwright/test';
test.beforeEach(async ({
  page
}) => {
  await page.goto('/');
  await expect(page.getByRole('button', {
    name: 'Add expense',
    exact: true
  }).first()).toBeEnabled();
});
test('validates, creates, persists, filters, edits, exports and deletes expenses', async ({
  page
}) => {
  await page.getByRole('button', {
    name: 'Add expense',
    exact: true
  }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', {
    name: 'Add expense',
    exact: true
  }).click();
  await expect(dialog.getByText(/description between/)).toBeVisible();
  await dialog.getByLabel('Description').fill('E2E groceries');
  await dialog.getByLabel('Amount (USD)').fill('42.50');
  await dialog.getByLabel('Date', {
    exact: true
  }).fill('2026-01-15');
  await dialog.getByLabel('Category', {
    exact: true
  }).selectOption('Food');
  await dialog.getByRole('button', {
    name: 'Add expense',
    exact: true
  }).click();
  await expect(page.getByText('Expense added.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('E2E groceries')).toBeVisible();
  await page.getByLabel('Search expenses').fill('groceries');
  await page.getByLabel('Filter category').selectOption('Bills');
  await expect(page.getByText('No expenses here yet')).toBeVisible();
  await page.getByLabel('Filter category').selectOption('Food');
  await page.getByLabel('Start date').fill('2026-01-15');
  await page.getByLabel('End date').fill('2026-01-15');
  await expect(page.getByText('E2E groceries')).toBeVisible();
  await page.getByLabel('Edit E2E groceries').click();
  await dialog.getByLabel('Amount (USD)').fill('55.25');
  await dialog.getByRole('button', {
    name: 'Save changes'
  }).click();
  await expect(page.getByRole('cell', {
    name: '$55.25',
    exact: true
  })).toBeVisible();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', {
    name: 'Export CSV'
  }).click();
  expect((await downloaded).suggestedFilename()).toBe('folio-expenses.csv');
  await page.getByLabel('Delete E2E groceries').click();
  await dialog.getByRole('button', {
    name: 'Cancel'
  }).click();
  await expect(page.getByText('E2E groceries')).toBeVisible();
  await page.getByLabel('Delete E2E groceries').click();
  await dialog.getByRole('button', {
    name: 'Delete expense'
  }).click();
  await expect(page.getByText('No expenses here yet')).toBeVisible();
  await page.reload();
  await expect(page.getByText('No expenses here yet')).toBeVisible();
});
test('sample analytics and responsive navigation', async ({
  page,
  isMobile
}) => {
  await page.getByRole('button', {
    name: /Try sample data/
  }).click();
  await expect(page.getByText('16 expenses tracked')).toBeVisible();
  if (isMobile) await page.getByLabel('Open navigation').click();
  await page.getByRole('button', {
    name: 'Insights',
    exact: true
  }).click();
  await expect(page.getByRole('heading', {
    name: 'Small details. Big insights.'
  })).toBeVisible();
  await expect(page.getByRole('img', {
    name: /Spending by category/
  })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test('preserves corrupt data and reports error', async ({
  page
}) => {
  await page.evaluate(() => localStorage.setItem('folio.expenses.v1', '{'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('preserved');
  await expect(page.getByRole('button', {
    name: 'Add expense',
    exact: true
  }).first()).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('folio.expenses.v1'))).toBe('{');
});
