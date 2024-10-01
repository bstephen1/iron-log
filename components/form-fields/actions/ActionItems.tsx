import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, Button, Paper, Typography } from '@mui/material'
import FormDivider from '../../forms/FormDivider'
import DeleteButton from './DeleteButton'
import UsageButton from './UsageButton'
import { memo } from 'react'

interface Props {
  /** name of currently selected option */
  name: string
  /** type of the option */
  type: 'exercise' | 'category' | 'modifier'
  handleDelete?: (name: string) => void
  handleDuplicate?: (name: string) => void
  deleteDisabled?: boolean
}
/** render all common action items  */
export default memo(function ActionItems({
  name,
  type,
  handleDelete,
  handleDuplicate,
  deleteDisabled,
}: Props) {
  return (
    <>
      <FormDivider title="Actions" />
      {handleDuplicate && (
        <ActionItem
          description={`Create a new ${type} which is a duplicate of this ${type}.`}
          button={
            <Button
              onClick={() => handleDuplicate(name)}
              startIcon={<ContentCopyIcon />}
            >
              Duplicate
            </Button>
          }
        />
      )}
      {type === 'exercise' && (
        <ActionItem
          description="View the most recent dates when this exercise has been used."
          button={<UsageButton name={name} />}
        />
      )}
      {handleDelete && (
        <ActionItem
          description={`Delete this ${type}. The ${type} must be unused in any ${type === 'exercise' ? 'exercise records' : 'exercises'}.`}
          button={
            <DeleteButton
              type={type}
              name={name}
              handleDelete={() => handleDelete(name)}
              buttonProps={{ disabled: !!deleteDisabled }}
            />
          }
        />
      )}
    </>
  )
})

interface ActionItemProps {
  button: JSX.Element
  description: string
}
function ActionItem({ button, description }: ActionItemProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 1,
        my: 2,
      }}
    >
      <Typography display="flex" alignItems="center">
        {description}
      </Typography>
      {/* weirdly, this only needs display flex to become centered */}
      <Box px={2} display="flex">
        {button}
      </Box>
    </Paper>
  )
}
