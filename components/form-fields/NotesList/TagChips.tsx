import {
  Box,
  Chip,
  ChipProps,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'

interface Props {
  selected: string[]
}
export default function TagChips({ selected }: Props) {
  const theme = useTheme()
  // todo: can monitor length of note and if it is overflowing?
  const displayedTagsAmount = useMediaQuery(theme.breakpoints.up('sm')) ? 2 : 1

  const StyledChip = (props: ChipProps) => (
    <Chip {...props} sx={{ cursor: 'inherit', ...props.sx }} />
  )

  return (
    <Tooltip title="add tags">
      <Box
        sx={{
          display: 'flex',
          // flexWrap: 'wrap',
          gap: 0.5,
        }}
      >
        {
          selected.length ? (
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
              label="no tags"
              color="default"
              sx={{ fontStyle: 'italic' }}
            />
          )
          // : <Tag color="primary" />
        }
      </Box>
    </Tooltip>
  )
}
