import { Chip, ChipProps, Stack } from '@mui/material'

interface Props {
  selected?: string | string[]
  multiple?: boolean
}
export default function TagChips({ selected = [], multiple }: Props) {
  const tagPluralOrSingle = multiple ? 'tags' : 'tag'
  selected = typeof selected === 'string' ? [selected] : selected

  const StyledChip = (props: ChipProps) => (
    <Chip {...props} sx={{ cursor: 'inherit', ...props.sx }} />
  )

  return (
    <Stack spacing={0.5}>
      {selected.length ? (
        selected.map((value) => <StyledChip key={value} label={value} />)
      ) : (
        <StyledChip
          label={'no ' + tagPluralOrSingle}
          color="default"
          sx={{ fontStyle: 'italic' }}
        />
      )}
    </Stack>
  )
}
