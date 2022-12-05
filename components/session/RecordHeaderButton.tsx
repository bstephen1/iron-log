import {
  Tooltip,
  IconButton,
  TooltipProps,
  IconButtonProps,
} from '@mui/material'

interface Props extends Partial<IconButtonProps> {
  title: string
  children?: JSX.Element
  tooltipProps?: Partial<TooltipProps>
}
export default function RecordHeaderButton({
  title,
  tooltipProps,
  children,
  ...iconButtonProps
}: Props) {
  return (
    <Tooltip title={title} placement="bottom-end" {...tooltipProps}>
      <IconButton {...iconButtonProps}>{children}</IconButton>
    </Tooltip>
  )
}
