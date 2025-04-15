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
      <Tooltip title={tooltip}>
        <IconButton {...iconButtonProps}>{children}</IconButton>
      </Tooltip>
    </Grow>
  )
}
