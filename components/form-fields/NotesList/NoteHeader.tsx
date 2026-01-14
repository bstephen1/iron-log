import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { ComponentProps, JSX } from 'react'
import TransitionIconButton from '../../TransitionIconButton'
import TagSelect from './TagSelect'

interface Props {
  tagSelectProps: ComponentProps<typeof TagSelect>
  actions?: {
    label: string
    Icon: JSX.Element
    onClick: () => void
    isHidden?: boolean
  }[]
}
export default function NoteHeader({ tagSelectProps, actions }: Props) {
  return (
    <Stack direction="row" sx={{ pl: 0.5 }}>
      <TagSelect {...tagSelectProps} />
      <Box flex="1 1 auto" />
      <Stack direction="row">
        {actions?.map(({ label, Icon, onClick, isHidden }) => (
          // div wrappers allow icons to keep a square shape if tags become multiline
          <div key={label}>
            <TransitionIconButton
              isVisible={!isHidden}
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
