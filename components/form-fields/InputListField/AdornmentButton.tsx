import { Grow, IconButton } from '@mui/material'
import { MouseEventHandler } from 'react'

interface Props {
  handleClick: MouseEventHandler<HTMLButtonElement>
  isVisible: boolean
  ariaLabel?: string
  children?: JSX.Element
}
export default function AdornmentButton({
  handleClick,
  isVisible,
  ariaLabel,
  children,
}: Props) {
  return (
    <Grow in={isVisible}>
      <IconButton type="button" aria-label={ariaLabel} onClick={handleClick}>
        {children}
      </IconButton>
    </Grow>
  )
}
