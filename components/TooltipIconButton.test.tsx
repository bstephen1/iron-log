import { expect, it, vi } from 'vitest'
import { render, screen } from '../lib/test/rtl'
import TooltipIconButton, { MenuItemContext } from './TooltipIconButton'

const mockClick = vi.fn()
const mockClickButton = vi.fn()
const mockClickMenu = vi.fn()
const mockCloseMenu = vi.fn()

it('renders normal button with onClick', async () => {
  const { user } = render(
    <TooltipIconButton title="my button" onClick={mockClick} />
  )

  expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()

  await user.click(screen.getByRole('button'))
  expect(mockClick).toHaveBeenCalled()
})

it('prioritizes onClickButton for normal button', async () => {
  const { user } = render(
    <TooltipIconButton
      title="my button"
      onClick={mockClick}
      onClickButton={mockClickButton}
      onClickMenu={mockClickMenu}
    />
  )

  await user.click(screen.getByRole('button'))
  expect(mockClick).not.toHaveBeenCalled()
  expect(mockClickMenu).not.toHaveBeenCalled()
  expect(mockClickButton).toHaveBeenCalled()
})

it('renders menu button with onClick', async () => {
  const { user } = render(
    <MenuItemContext value={{ closeMenu: mockCloseMenu }}>
      <TooltipIconButton title="my button" onClick={mockClick} />
    </MenuItemContext>
  )

  await user.click(screen.getByRole('menuitem'))
  expect(mockClick).toHaveBeenCalled()
  expect(mockCloseMenu).toHaveBeenCalled()
})

it('prioritizes onClickMenu for menu item', async () => {
  const { user } = render(
    <MenuItemContext value={{ closeMenu: mockCloseMenu }}>
      <TooltipIconButton
        title="my button"
        onClick={mockClick}
        onClickMenu={mockClickMenu}
        onClickButton={mockClickButton}
      />
    </MenuItemContext>
  )

  await user.click(screen.getByRole('menuitem'))
  expect(mockClick).not.toHaveBeenCalled()
  expect(mockClickButton).not.toHaveBeenCalled()
  expect(mockClickMenu).toHaveBeenCalled()
})
