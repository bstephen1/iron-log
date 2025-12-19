import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import { type ComponentProps, type JSX, type ReactNode, useState } from 'react'
import TooltipIconButton, { MenuItemContext } from '../../../TooltipIconButton'

interface Props {
  actions: JSX.Element[]
}
export default function MoreActionsButton({ actions }: Props) {
  const isVisible = !!actions.length
  const [keepMounted, setKeepMounted] = useState(false)
  const [moreButtonsAnchorEl, setMoreButtonsAnchorEl] =
    useState<null | HTMLElement>(null)

  const closeMenu = () => setMoreButtonsAnchorEl(null)

  return (
    <>
      {isVisible && (
        <TooltipIconButton
          title="More..."
          onClick={(e) => setMoreButtonsAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon />
        </TooltipIconButton>
      )}
      <Menu
        id="more options menu"
        anchorEl={moreButtonsAnchorEl}
        open={!!moreButtonsAnchorEl}
        onClose={closeMenu}
        keepMounted={keepMounted}
      >
        {actions.map((Action) => (
          <MenuPropsInjector
            key={Action.key}
            closeMenu={() => {
              // If the action button is a dialog, the menu must stay mounted
              // so the dialog doesn't immediately close. However, there is a bizarre
              // interaction with swiper that causes the menu to stay invisibly active
              // even after closing when keepMounted is true and swiper.update()/slideTo()
              // is called. This occurs in SwapRecordButton (but ONLY when swapping to the right).
              // So for non-dialogs, we have to keep the menu NOT mounted on click.
              // Note that for this to work all dialog actions must include "dialog" in their key.
              setKeepMounted(!!Action.key?.includes('dialog'))
              closeMenu()
            }}
          >
            {Action}
          </MenuPropsInjector>
        ))}
      </Menu>
    </>
  )
}

/** Menu injects hidden props into MenuItems to handle keyboard selection.
 *  We have to intercept those props and pass them along to the MenuItem.
 */
const MenuPropsInjector = (
  props: ComponentProps<typeof MenuItemContext>['value'] & {
    children: ReactNode
  }
) => <MenuItemContext value={props}>{props.children}</MenuItemContext>
