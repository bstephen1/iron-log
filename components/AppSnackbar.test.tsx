import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { expect, it } from 'vitest'
import { render, screen } from '../lib/util/test/rtl'
import AppSnackbar from './AppSnackbar'

const renderSnackbarAndExpectVisible = async (
  options: Parameters<typeof enqueueSnackbar>[1] = {}
) => {
  const { user } = render(
    <SnackbarProvider Components={{ default: AppSnackbar }} />
  )

  enqueueSnackbar('message', options)
  expect(await screen.findByText('message')).toBeVisible()

  return user
}

it('renders without severity', async () => {
  await renderSnackbarAndExpectVisible()
})

it('renders with severity', async () => {
  const user = await renderSnackbarAndExpectVisible({
    severity: 'info',
    persist: true,
  })

  // with persist + severity there is a close button
  await user.click(screen.getByLabelText('Close'))
})
