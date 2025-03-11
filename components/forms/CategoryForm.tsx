import Grid from '@mui/material/Grid2'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  deleteCategory,
  useCategories,
  useExercises,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import { Category } from '../../models/AsyncSelectorOption/Category'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'

interface Props {
  category: Category
  handleUpdate: (id: string, updates: Partial<Category>) => Promise<void>
}
export default function CategoryForm({
  category: { name, _id },
  handleUpdate,
}: Props) {
  const { categoryNames, mutate: mutateCategories } = useCategories()
  const { exercises } = useExercises()
  const usage = getUsage(exercises, 'categories', name)
  const [_, setUrlCategory] = useQueryState('category')

  const updateFields = useCallback(
    (updates: Partial<Category>) => handleUpdate(_id, updates),
    [_id, handleUpdate]
  )

  const handleDelete = useCallback(
    async (name: string) => {
      await deleteCategory(name)
      setUrlCategory(null)
      mutateCategories((cur) =>
        cur?.filter((category) => category.name !== name)
      )
    },
    [mutateCategories, setUrlCategory]
  )

  return (
    <Grid container spacing={1} size={12}>
      <Grid size={12}>
        <NameField
          name={name}
          handleUpdate={updateFields}
          options={categoryNames}
        />
      </Grid>
      <Grid size={12}>
        <UsageComboBox field="categories" name={name} usage={usage} />
      </Grid>
      <Grid size={12}>
        <ActionItems
          name={name}
          type="category"
          handleDelete={handleDelete}
          deleteDisabled={!!usage.length}
        />
      </Grid>
    </Grid>
  )
}
