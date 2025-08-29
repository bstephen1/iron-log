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

    // wait for everything to finish processing and Add Record is reset to default
    await expect(
      this.page.getByRole('button', { name: 'Add Record' })
    ).toBeDisabled()
  }
}
