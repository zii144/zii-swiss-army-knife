import { test, expect } from '@playwright/test';

// The language picker in the nav is the custom Select. It replaces a native
// <select>, so it has to carry the semantics a native one would provide.
const TRIGGER = '.ui-select--pill .ui-select__trigger';

test('the trigger exposes combobox semantics wired to its listbox', async ({ page }) => {
  await page.goto('/en');
  const trigger = page.locator(TRIGGER);
  await expect(trigger).toBeVisible();

  await expect(trigger).toHaveAttribute('role', 'combobox');
  await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  // aria-controls must resolve to the listbox that is actually open — ARIA
  // only honours aria-activedescendant on a composite role like combobox.
  const controls = await trigger.getAttribute('aria-controls');
  expect(controls).toBeTruthy();
  const listbox = page.locator(`[id="${controls!}"]`);
  await expect(listbox).toHaveAttribute('role', 'listbox');

  const activeId = await trigger.getAttribute('aria-activedescendant');
  expect(activeId).toBeTruthy();
  const activeOption = page.locator(`[id="${activeId!}"]`);
  await expect(activeOption).toHaveAttribute('role', 'option');
  await expect(activeOption).toHaveClass(/is-active/);
});

test('arrow keys move aria-activedescendant and Enter commits', async ({ page }) => {
  await page.goto('/en');
  const trigger = page.locator(TRIGGER);

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const first = await trigger.getAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowDown');
  const second = await trigger.getAttribute('aria-activedescendant');
  expect(second).not.toBe(first);
  await expect(page.locator(`[id="${second!}"]`)).toHaveAttribute('aria-selected', 'false');

  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  // Committing a language actually navigates — the picker is wired to the router.
  await expect(page).not.toHaveURL(/\/en$/);
  // Focus returns to the trigger so keyboard users are not dropped at the top.
  await expect(trigger).toBeFocused();
});

test('Escape closes without committing a change', async ({ page }) => {
  await page.goto('/en');
  const trigger = page.locator(TRIGGER);

  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/\/en$/);
});

test('typing a character jumps to the matching option', async ({ page }) => {
  await page.goto('/en');
  const trigger = page.locator(TRIGGER);

  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('D'); // Deutsch

  const activeId = await trigger.getAttribute('aria-activedescendant');
  await expect(page.locator(`[id="${activeId!}"]`)).toContainText('Deutsch');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/de$/);
});
