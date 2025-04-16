import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material'
import { useState } from 'react'

/** The tooltip provided by mui does not follow aria accessibility
 *  best practices when a button is disabled. Mui recommends wrapping
 *  the button in \<span>, but this removes the aria label from the button.
 *  If you don't wrap in \<span> mui logs a console warning since the
 *  tooltip will not be visible on a disabled element. This component suppresses
 *  that warning, since that is desired behavior.
 *
 *  See: https://github.com/mui/material-ui/issues/33182
 */
export default function Tooltip({ children, ...props }: TooltipProps) {
  // making the input controlled suppresses the mui warning
  // See: https://github.com/mui/material-ui/blob/8d9b80de565ded6c6d0d04c395f8ee569da974b4/packages/mui-material/src/Tooltip/Tooltip.js#L385
  // PR: https://github.com/mui/material-ui/pull/15304
  const [open, setOpen] = useState(false)

  return (
    <MuiTooltip
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      {...props}
    >
      {children}
    </MuiTooltip>
  )
}
