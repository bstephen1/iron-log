import Chip, { type ChipProps } from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

interface Props {
  value: string | string[]
  multiple?: boolean
}
export default function TagChips({ value, multiple }: Props) {
  const tagPluralOrSingle = multiple ? 'tags' : 'tag'
  if (!value.length) {
    // empty string/array signifies no tags
    value = []
  } else if (typeof value === 'string') {
    // convert non-multiple mode to an array
    value = [value]
  }

  const StyledChip = (props: ChipProps) => (
    <Chip {...props} sx={{ cursor: 'inherit', ...props.sx }} />
  )

  return (
    <Stack spacing={0.5}>
      {value.length ? (
        value.map((value) => <StyledChip key={value} label={value} />)
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
