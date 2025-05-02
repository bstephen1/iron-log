import {
  IconButton,
  type IconButtonProps,
  MenuItem,
  type MenuItemProps,
  type TooltipProps,
} from '@mui/material'
import { createContext, useContext, type JSX } from 'react'
import Tooltip from './Tooltip'

/** context for TooltipIconButtons. Allows parent to determine
 *  whether to render as a menu item on a predefined component.
 */
export const MenuItemContext = createContext<MenuItemProps>({})
export const IsMenuContext = createContext(false)

interface Props extends Partial<IconButtonProps> {
  title: string
  children?: JSX.Element
  tooltipProps?: Partial<TooltipProps>
  onClick?: () => void
  /** same as onClick, but includes icon button typing.
   *  If provided, this will override onClick() behavior for IconButtons.
   *  Needed because otherwise ts throws a fit for onClick since it's used
   *  for both MenuItem and IconButton.
   */
  onClickButton?: IconButtonProps['onClick']
  /** same as onClick, but includes menu button typing.
   *  If provided, this will override onClick() behavior for MenuItems.
   *  Needed because otherwise ts throws a fit for onClick since it's used
   *  for both MenuItem and IconButton.
   */
  onClickMenu?: MenuItemProps['onClick']
  disabled?: boolean
}
export default function TooltipIconButton({
  title,
  tooltipProps,
  children,
  onClick,
  onClickButton,
  onClickMenu,
  disabled,
  ...iconButtonProps
}: Props) {
  const isMenuItem = useContext(IsMenuContext)
  const menuItemProps = useContext(MenuItemContext)

  return isMenuItem ? (
    <Tooltip title={title} placement="left" {...tooltipProps}>
      <MenuItem
        onClick={onClickMenu ?? onClick}
        disabled={disabled}
        {...menuItemProps}
      >
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          {...iconButtonProps}
        >
          {children}
        </IconButton>
      </MenuItem>
    </Tooltip>
  ) : (
    <Tooltip title={title} placement="bottom-end" {...tooltipProps}>
      <IconButton
        onClick={onClickButton ?? onClick}
        disabled={disabled}
        {...iconButtonProps}
      >
        {children}
      </IconButton>
    </Tooltip>
  )
}
