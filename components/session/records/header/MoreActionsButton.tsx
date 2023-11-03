import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Menu, MenuItemProps } from '@mui/material'
import { memo, ReactNode, useState } from 'react'
import isEqual from 'react-fast-compare'
import TooltipIconButton, {
  IsMenuContext,
  MenuItemContext,
} from '../../../TooltipIconButton'

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
      <IsMenuContext.Provider value={true}>
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
      </IsMenuContext.Provider>
    </>
  )
}, isEqual)

/** Menu injects hidden props into MenuItems to handle keyboard selection.
 *  We have to intercept those props and pass them along to the MenuItem.
 */
const MenuPropsInjector = (props: Partial<MenuItemProps>) => (
  <MenuItemContext.Provider value={props}>
    {props.children}
  </MenuItemContext.Provider>
)
