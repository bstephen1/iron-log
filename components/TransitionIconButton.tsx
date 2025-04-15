import { Grow, IconButton, IconButtonProps, Tooltip } from '@mui/material'
import { JSX } from 'react'

interface Props extends IconButtonProps {
  isVisible?: boolean
  tooltip?: string
  children?: JSX.Element
}
export default function TransitionIconButton({
  isVisible,
  tooltip,
  children,
  ...iconButtonProps
}: Props) {
  return (
    <Grow in={isVisible}>
      {/* have to explicitly remove the tooltip if disabled to avoid mui warning */}
      <Tooltip title={iconButtonProps.disabled ? '' : tooltip}>
        {/* could wrap IconButton in a span to show tooltip when disabled */}
        <IconButton {...iconButtonProps}>{children}</IconButton>
      </Tooltip>
    </Grow>
  )
}
