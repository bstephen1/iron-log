import { expect, type Page } from '@playwright/test'

export class SessionsPage {
  constructor(public readonly page: Page) {}

  async goto(date: string) {
    await this.page.goto(`/sessions/${date}`)
  }

  async addRecord(exercise: string, date?: string) {
    if (date) {
      await this.goto(date)
    }

    // wait for loading
    await expect(this.page.getByRole('progressbar')).toHaveCount(0)

    await this.page.getByLabel('Exercise').last().fill(exercise)
    await this.page.keyboard.press('Enter')
    await this.page.getByText('Add record').click()

    // tried passing in the extendedPage with waitForSave, which was
    // doable but seemed that it wasn't actually waiting
    await expect(this.page.getByLabel('Saving...')).not.toBeVisible()
  }
}
