import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem'
import type { TooltipProps } from '@mui/material/Tooltip'
import { createContext, type JSX, use } from 'react'
import Tooltip from './Tooltip'

/** If the IconButton is being rendered inside a menu, it will render its
 *  own MenuItems, but it must be passed the parent menu props.
 */
export const MenuItemContext = createContext<
  (MenuItemProps & { closeMenu: () => void }) | null
>(null)

interface Props extends Partial<IconButtonProps> {
  title: string
  children?: JSX.Element
  tooltipProps?: Partial<TooltipProps>
  /** this onClick may be passed to either the menu or the button depending
   *  on if MenuItemContext is provided, so uses a generic event handler.
   */
  onClick?: (e: { currentTarget: HTMLElement }) => void
  /** same as onClick, but includes icon button typing.
   *  If provided, this will override onClick() behavior for IconButtons.
   *  Use this if you need the event handler from the button.
   */
  onClickButton?: IconButtonProps['onClick']
  /** same as onClick, but includes menu button typing.
   *  If provided, this will override onClick() behavior for MenuItems.
   *  Use this if you need the event handler for the menu item.
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
  const menuItemProps = use(MenuItemContext)

  if (menuItemProps) {
    const { closeMenu, ...rest } = menuItemProps
    return (
      <Tooltip title={title} placement="left" {...tooltipProps}>
        <MenuItem
          onClick={(e) => {
            // for SwapRecord button the menu needs to be closed BEFORE
            // the record swap initiates and swiper tries to update itself,
            // otherwise it majorly glitches out and gets stuck between slides.
            closeMenu()
            onClickMenu ? onClickMenu(e) : onClick?.(e)
          }}
          disabled={disabled}
          {...rest}
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
    )
  }

  return (
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
