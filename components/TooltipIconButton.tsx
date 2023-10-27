import {
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from '@mui/material'

interface Props extends Partial<IconButtonProps> {
  title: string
  children?: JSX.Element
  tooltipProps?: Partial<TooltipProps>
}
export default function TooltipIconButton({
  title,
  tooltipProps,
  children,
  ...iconButtonProps
}: Props) {
  return (
    <Tooltip title={title} placement="bottom-end" {...tooltipProps}>
      {/* Tooltip can't have its direct child be disabled so add in a buffer. Note a react Fragment won't work. */}
      <span>
        <IconButton {...iconButtonProps}>{children}</IconButton>
      </span>
    </Tooltip>
  )
}