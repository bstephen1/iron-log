import { Box, Chip, ChipProps, useMediaQuery, useTheme } from '@mui/material'

interface Props {
  selected: string | string[]
  multiple?: boolean
  readOnly?: boolean
}
export default function TagChips({ selected, multiple, readOnly }: Props) {
  const theme = useTheme()
  // todo: can monitor length of note and if it is overflowing?
  const displayedTagsAmount = useMediaQuery(theme.breakpoints.up('sm')) ? 2 : 1

  const tagPluralOrSingle = multiple ? 'tags' : 'tag'
  selected = typeof selected === 'string' ? [selected] : selected

  const StyledChip = (props: ChipProps) => (
    <Chip {...props} sx={{ cursor: 'inherit', ...props.sx }} />
  )

  return (
    <Box
      sx={{
        display: 'flex',
        // flexWrap: 'wrap',
        gap: 0.5,
      }}
    >
      {
        selected?.length ? (
          selected
            .slice(0, displayedTagsAmount + 1)
            .map((value, i) =>
              i < displayedTagsAmount ? (
                <StyledChip key={value} label={value} />
              ) : (
                <StyledChip
                  key={value}
                  label={`+${selected.length - displayedTagsAmount}...`}
                />
              )
            )
        ) : (
          <StyledChip
            label={'no ' + tagPluralOrSingle}
            color="default"
            sx={{ fontStyle: 'italic' }}
          />
        )
        // : <Tag color="primary" />
      }
    </Box>
  )
}
