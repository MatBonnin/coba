// tests/playgame.spec.ts
import { expect, test } from '@playwright/test'

const APP_URL = 'http://localhost:5174/'

test.describe('Composant PlayGame – drag & drop et validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL)
    // On considère qu’on cible la Partie 1
    await expect(page.locator('h2:has-text("Partie 1")')).toBeVisible()
  })

  test('1. Affiche les 3 colonnes Restants / Groupe A / Groupe B', async ({ page }) => {
    for (const title of ['Restants', 'Groupe A', 'Groupe B']) {
      await expect(page.locator(`.pg-column-title:text-matches("${title}", "i")`)).toBeVisible()
    }
  })

  test('2. Au lancement, tous les dés sont dans "Restants"', async ({ page }) => {
    const rem = page.locator('.pg-column#remaining .pg-dice-list button')
    await expect(rem).toHaveCount(7)
  })

  test('3. Drag-and-drop d’un dé de Restants → Groupe A', async ({ page }) => {
    const firstDie = page.locator('.pg-column#remaining button').first()
    const dropA = page.locator('.pg-column#A')
    await firstDie.dragTo(dropA)
    await expect(page.locator('.pg-column#A button')).toHaveCount(1)
    await expect(page.locator('.pg-column#remaining button')).toHaveCount(6)
  })

  test('4. Drag-and-drop d’un dé de Restants → Groupe B', async ({ page }) => {
    const die = page.locator('.pg-column#remaining button').nth(1)
    const dropB = page.locator('.pg-column#B')
    await die.dragTo(dropB)
    await expect(page.locator('.pg-column#B button')).toHaveCount(1)
    await expect(page.locator('.pg-column#remaining button')).toHaveCount(6)
  })

  test('5. Valider sans assigner tous les dés → message d’erreur d’assignation', async ({ page }) => {
    await page.click('button:has-text("Valider")')
    await expect(page.locator('.pg-message')).toHaveText('Assignez tous les dés dans Groupe A ou Groupe B.')
  })

  test('6. Tentative d’équilibrage incorrect → message d’échec', async ({ page }) => {
    // On balance 4 dés dans A, 3 dés dans B au pif
    const dies = page.locator('.pg-column#remaining button')
    for (let i = 0; i < 4; i++) {
      await dies.nth(i).dragTo(page.locator('.pg-column#A'))
    }
    for (let i = 4; i < 7; i++) {
      await dies.nth(i).dragTo(page.locator('.pg-column#B'))
    }
    await page.click('button:has-text("Valider")')
    await expect(page.locator('.pg-message')).toHaveText(/⚠️ Pas équilibré \(\d+ ≠ \d+\)\. Réessaie !/)
  })

  test('7. Équilibrage automatique via getSolution → message de succès', async ({ page }) => {
    // On clique sur le bouton "Calculer la solution" qui place automatiquement la solution
    await page.click('button:has-text("Calculer la solution")')
    // Puis on valide
    await page.click('button:has-text("Valider")')
    await expect(page.locator('.pg-message')).toHaveText(/🎉 Bravo ! Équilibre trouvé : \d+ = \d+/)
  })

  test('8. Drag vers la même colonne ne change rien', async ({ page }) => {
    const die = page.locator('.pg-column#remaining button').first()
    // drag to remaining
    await die.dragTo(page.locator('.pg-column#remaining'))
    await expect(page.locator('.pg-column#remaining button')).toHaveCount(7)
  })

  test('9. On peut retirer un dé de Groupe A en le re-dropant dans Restants', async ({ page }) => {
    // d'abord déplacer un dé
    const die = page.locator('.pg-column#remaining button').first()
    await die.dragTo(page.locator('.pg-column#A'))
    await expect(page.locator('.pg-column#A button')).toHaveCount(1)
    // puis le remettre dans Restants
    const inA = page.locator('.pg-column#A button').first()
    await inA.dragTo(page.locator('.pg-column#remaining'))
    await expect(page.locator('.pg-column#A button')).toHaveCount(0)
    await expect(page.locator('.pg-column#remaining button')).toHaveCount(7)
  })

  test('10. Chaque instance PlayGame est isolée (Partie 2 indépendante de Partie 1)', async ({ page }) => {
    // Partie 2 starts with its own remaining = 7
    const part2 = page.locator('h2:text-matches("Partie 2", "i")')
      .locator('xpath=ancestor::div[contains(@class,"w-100")]')
    await expect(part2.locator('.pg-column#remaining button')).toHaveCount(7)
    // On y drague un dé
    await part2.locator('.pg-column#remaining button').first()
      .dragTo(part2.locator('.pg-column#A'))
    await expect(part2.locator('.pg-column#A button')).toHaveCount(1)
    // Et on vérifie que Partie 1 n’est pas affectée
    const part1 = page.locator('h2:text-matches("Partie 1", "i")')
      .locator('xpath=ancestor::div[contains(@class,"w-100")]')
    await expect(part1.locator('.pg-column#A button')).toHaveCount(0)
  })
})
