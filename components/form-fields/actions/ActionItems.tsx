import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { type JSX, memo } from 'react'
import FormDivider from '../../forms/FormDivider'
import DeleteButton from './DeleteButton'
import UsageButton from './UsageButton'

interface Props {
  id: string
  name: string
  type: 'exercise' | 'category' | 'modifier'
  handleDelete?: (id: string) => void
  handleDuplicate?: (id: string) => void
  deleteDisabled?: boolean
}
export default memo(function ActionItems({
  type,
  id,
  name,
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
              onClick={() => handleDuplicate(id)}
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
              handleDelete={() => handleDelete(id)}
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
