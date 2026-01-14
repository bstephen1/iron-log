import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { ComponentProps, JSX } from 'react'
import TransitionIconButton from '../../TransitionIconButton'
import TagSelect from './TagSelect'

interface Props {
  tagSelectProps: ComponentProps<typeof TagSelect>
  hideActions?: boolean
  actions?: {
    label: string
    Icon: JSX.Element
    onClick: () => void
  }[]
}
export default function NoteHeader({
  tagSelectProps,
  hideActions,
  actions,
}: Props) {
  return (
    <Stack direction="row" sx={{ pl: 0.5 }}>
      <TagSelect {...tagSelectProps} />
      <Box flex="1 1 auto" />
      <Stack direction="row">
        {actions?.map(({ label, Icon, onClick }) => (
          // div wrappers allow icons to keep a square shape if tags become multiline
          <div key={label}>
            <TransitionIconButton
              isVisible={!hideActions}
              onClick={onClick}
              tooltip={label}
              size="small"
            >
              {Icon}
            </TransitionIconButton>
          </div>
        ))}
      </Stack>
    </Stack>
  )
}
