// tests/playgame.spec.ts
import { expect, test } from '@playwright/test'

const APP_URL = 'http://localhost:5174/'

test.describe('Composant PlayGame – drag & drop et validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL)
    // On attend bien le titre de la première partie
    await expect(page.locator('h2:has-text("Partie 1")')).toBeVisible()
  })

  // Sélecteurs utilitaires
  const col = (page, index: number) =>
    page.locator('.pg-column').nth(index)
  const diceIn = (col) =>
    col.locator('button.pg-die-button')

  test('1. Affiche les 3 colonnes Restants / Groupe A / Groupe B', async ({ page }) => {
    const titles = await page.locator('.pg-column-title').allTextContents()
    expect(titles).toEqual(['Restants', 'Groupe A', 'Groupe B'])
  })

  test('2. Au lancement, tous les dés sont dans "Restants"', async ({ page }) => {
    await expect(diceIn(col(page, 0))).toHaveCount(7)
    await expect(diceIn(col(page, 1))).toHaveCount(0)
    await expect(diceIn(col(page, 2))).toHaveCount(0)
  })

  test('3. Drag Restants → Groupe A', async ({ page }) => {
    const c0 = col(page, 0)
    const c1 = col(page, 1)
    const die = diceIn(c0).first()
    await die.dragTo(c1)
    await expect(diceIn(c1)).toHaveCount(1)
    await expect(diceIn(c0)).toHaveCount(6)
  })

  test('4. Drag Restants → Groupe B', async ({ page }) => {
    const c0 = col(page, 0)
    const c2 = col(page, 2)
    const die = diceIn(c0).nth(1)
    await die.dragTo(c2)
    await expect(diceIn(c2)).toHaveCount(1)
    await expect(diceIn(c0)).toHaveCount(6)
  })

  test('5. Valider sans assigner tous les dés → message d’erreur', async ({ page }) => {
    await page.click('button:has-text("Valider")')
    await expect(page.locator('.pg-message')).toHaveText(
      'Assignez tous les dés dans Groupe A ou Groupe B.'
    )
  })



  test('8. Drag vers même colonne ne modifie pas', async ({ page }) => {
    const c0 = col(page, 0)
    const dies = diceIn(c0)
    await dies.first().dragTo(c0)
    await expect(diceIn(c0)).toHaveCount(7)
  })

  test('9. On peut retirer un dé de A → Restants', async ({ page }) => {
    const c0 = col(page, 0)
    const c1 = col(page, 1)
    // déplacer un dé en A
    await diceIn(c0).first().dragTo(c1)
    await expect(diceIn(c1)).toHaveCount(1)
    // le remettre
    await diceIn(c1).first().dragTo(c0)
    await expect(diceIn(c1)).toHaveCount(0)
    await expect(diceIn(c0)).toHaveCount(7)
  })


})
