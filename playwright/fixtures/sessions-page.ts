import type { Page } from '@playwright/test'

export class SessionsPage {
  constructor(public readonly page: Page) {}

  async goto(date: string) {
    await this.page.goto(`/sessions/${date}`)
  }

  async addRecord(exercise: string, date?: string) {
    if (date) {
      await this.goto(date)
    }
    await this.page.getByLabel('Exercise').last().fill(exercise)
    await this.page.keyboard.press('Enter')
    await this.page.getByText('Add record').click()
  }
}
