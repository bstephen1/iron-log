import { type JSX } from 'react'
import Tooltip from './Tooltip'
import Grow from '@mui/material/Grow'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'

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
