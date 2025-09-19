import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import {
  type ComponentProps,
  type JSX,
  memo,
  type ReactNode,
  useState,
} from 'react'
import isEqual from 'react-fast-compare'
import TooltipIconButton, { MenuItemContext } from '../../../TooltipIconButton'

interface Props {
  actions: JSX.Element[]
}
export default memo(function MoreActionsButton({ actions }: Props) {
  const isVisible = !!actions.length
  const [moreButtonsAnchorEl, setMoreButtonsAnchorEl] =
    useState<null | HTMLElement>(null)

  const closeMenu = (_e?: unknown, reason?: string) => {
    // if a child button opens a nested menu, this menu's onClose handler
    // is triggered with an undefined reason. If this menu is closed the
    // child will also be closed since it is mounted within.
    // Previously keepVisible was enabled but this causes issues
    // with the SwapRecord buttons, where after clicking the menu is invisible
    // but still active and you have to reload the page.
    !!reason && setMoreButtonsAnchorEl(null)
  }

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
      >
        {actions.map((Action) => (
          <MenuPropsInjector
            key={Action.key}
            closeMenu={() => closeMenu({}, 'menu clicked')}
          >
            {Action}
          </MenuPropsInjector>
        ))}
      </Menu>
    </>
  )
}, isEqual)

/** Menu injects hidden props into MenuItems to handle keyboard selection.
 *  We have to intercept those props and pass them along to the MenuItem.
 */
const MenuPropsInjector = (
  props: ComponentProps<typeof MenuItemContext>['value'] & {
    children: ReactNode
  }
) => <MenuItemContext value={props}>{props.children}</MenuItemContext>
