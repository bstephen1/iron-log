import { Paper, Typography } from '@mui/material'
import FormDivider from '../forms/FormDivider'
import DeleteButton from '../manage/DeleteButton'

interface Props {
  /** name of currently selected option */
  name: string
  /** type of the option */
  type: 'exercise' | 'category' | 'modifier'
  handleDelete: () => void
  deleteDisabled?: boolean
}
/** render all common action items  */
export default function ActionItems({
  name,
  type,
  handleDelete,
  deleteDisabled,
}: Props) {
  return (
    <>
      <FormDivider title="Actions" />
      <ActionItem
        button={
          <DeleteButton
            type={type}
            name={name}
            handleDelete={handleDelete}
            buttonProps={{ disabled: deleteDisabled }}
          />
        }
        description={`Delete this ${type}. The ${type} must be unused in any exercises.`}
      />
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
      {button}
    </Paper>
  )
}
