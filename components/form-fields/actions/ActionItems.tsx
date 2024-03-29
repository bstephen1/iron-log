import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, Button, Paper, Typography } from '@mui/material'
import FormDivider from '../../forms/FormDivider'
import DeleteButton from './DeleteButton'
import UsageButton from './UsageButton'

interface Props {
  /** name of currently selected option */
  name: string
  /** type of the option */
  type: 'exercise' | 'category' | 'modifier'
  handleDelete?: () => void
  handleDuplicate?: () => void
  deleteDisabled?: boolean | number
}
/** render all common action items  */
export default function ActionItems({
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
            <Button onClick={handleDuplicate} startIcon={<ContentCopyIcon />}>
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
              handleDelete={handleDelete}
              buttonProps={{ disabled: !!deleteDisabled }}
            />
          }
        />
      )}
    </>
  )
}

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
