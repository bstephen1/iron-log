import FormDivider from '../forms/FormDivider'
import DeleteButton from '../manage/DeleteButton'
import ActionItem from './ActionItem'

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
