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
    const recordCount = await this.page
      .getByRole('button', { name: 'Add new set' })
      .count()

    await this.page.getByLabel('Exercise').last().fill(exercise)
    await this.page.keyboard.press('Enter')
    await this.page.getByText('Add record').click()

    // if page is refreshed before changes are saved, the changes would be aborted
    await expect(
      this.page.getByRole('button', { name: 'Add new set' })
    ).toHaveCount(recordCount + 1)
  }
}
