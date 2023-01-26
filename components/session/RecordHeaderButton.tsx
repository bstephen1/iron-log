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
export default function RecordHeaderButton({
  title,
  tooltipProps,
  children,
  ...iconButtonProps
}: Props) {
  return (
    <Tooltip title={title} placement="bottom-end" {...tooltipProps}>
      {/* Tooltip can't have its direct child be disabled so add in a buffer Fragment */}
      <>
        <IconButton {...iconButtonProps}>{children}</IconButton>
      </>
    </Tooltip>
  )
}
