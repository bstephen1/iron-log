import MoreVertIcon from '@mui/icons-material/MoreVert'
import { memo, type ReactNode, useState } from 'react'
import isEqual from 'react-fast-compare'
import TooltipIconButton, {
  IsMenuContext,
  MenuItemContext,
} from '../../../TooltipIconButton'
import Menu from '@mui/material/Menu'
import { type MenuItemProps } from '@mui/material/MenuItem'

interface Props {
  actions: ReactNode[]
}
export default memo(function MoreActionsButton({ actions }: Props) {
  const isVisible = !!actions.length
  const [moreButtonsAnchorEl, setMoreButtonsAnchorEl] =
    useState<null | HTMLElement>(null)

  const closeMenu = () => setMoreButtonsAnchorEl(null)

  return (
    <>
      {isVisible && (
        <TooltipIconButton
          title="More..."
          onClickButton={(e) => setMoreButtonsAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon />
        </TooltipIconButton>
      )}
      <IsMenuContext value={true}>
        <Menu
          id="more options menu"
          anchorEl={moreButtonsAnchorEl}
          open={!!moreButtonsAnchorEl}
          onClose={closeMenu}
          // Close menu when nested dialogs open.
          // Clicking a disabled button still counts as a blur event, so have to guard against that.
          onBlur={(e) => !e.target.ariaDisabled && closeMenu()}
          // prevents nested dialogs from being deleted when outer dialog closes
          keepMounted={isVisible}
        >
          {actions.map((Action, i) => (
            <MenuPropsInjector key={i}>{Action}</MenuPropsInjector>
          ))}
        </Menu>
      </IsMenuContext>
    </>
  )
}, isEqual)

/** Menu injects hidden props into MenuItems to handle keyboard selection.
 *  We have to intercept those props and pass them along to the MenuItem.
 */
const MenuPropsInjector = (props: Partial<MenuItemProps>) => (
  <MenuItemContext value={props}>{props.children}</MenuItemContext>
)
