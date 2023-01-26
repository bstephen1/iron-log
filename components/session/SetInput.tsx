import { Clear } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Fragment } from 'react'
import Set from '../../models/Set'
import NumericFieldAutosave from '../form-fields/NumericFieldAutosave'

interface Props {
  handleSubmit: (changes: Partial<Set>) => void
  handleDelete: () => void
  set: Set
  fields: (keyof Set)[]
}
// todo: indicator for failing a rep
// todo: swipe to delete for xs screen; remove X button on xs too (keep swipe delete throughout?)
// todo: currently not full width if not enough columns to max the width
export default function SetInput({
  handleSubmit,
  handleDelete,
  set,
  fields,
}: Props) {
  const pyStack = 0.5

  if (!fields.length) {
    return <></>
  }

  const convertValueToNumber = (value: string) => {
    value = value.trim()
    // have to explicitly handle an empty string because isNaN treats it as zero
    if (!value) {
      return undefined
    }
    // for some reason isNaN is requiring a number even though it casts to a number
    return isNaN(Number(value)) ? undefined : Number(value)
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      // border is from TextField underline
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        background: `${grey[100]}`, // todo
        py: pyStack,
        pl: 1,
      }}
    >
      {/* {!!set.unilateral && <Box>{set.unilateral.slice(0, 1).toUpperCase()}</Box>} */}
      {fields.map((field, i) => (
        <Fragment key={i}>
          {/* todo: store each field's delimiter and pull that here? */}
          {i > 0 && <Box px={1}>{field === 'effort' ? '@' : '/'}</Box>}
          <NumericFieldAutosave
            initialValue={String(set[field] ?? '')}
            // todo: add validation that this is a number
            handleSubmit={(value) =>
              handleSubmit({
                [field]: convertValueToNumber(value),
              })
            }
            sx={{ flexGrow: 1 }}
          />
        </Fragment>
      ))}
      {/* todo: maybe make this a "more..." with failed/warmup/delete options */}
      <IconButton
        size="small"
        onClick={handleDelete}
        sx={{
          my: -pyStack,
          p: 1,
          borderRadius: 0,
          '& .MuiTouchRipple-ripple .MuiTouchRipple-child': {
            borderRadius: 0,
          },
        }}
      >
        <Clear />
      </IconButton>
    </Stack>
  )
}
