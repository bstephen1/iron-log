import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { useCategories, useExercises } from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'
import {
  deleteCategory,
  updateCategoryFields,
} from '../../lib/backend/mongoService'

interface Props {
  category: Category
}
export default function CategoryForm({ category: { name, _id } }: Props) {
  const { categoryNames, mutate: mutateCategories } = useCategories()
  const { exercises, mutate: mutateExercises } = useExercises()
  const usage = getUsage(exercises, 'categories', name)
  const [_, setUrlCategory] = useQueryState('category')

  const updateFields = useCallback(
    async (updates: Partial<Category>) => {
      const updatedCategory = await updateCategoryFields(_id, updates)

      if (updates.name) {
        mutateExercises()
      }

      mutateCategories(async (cur) => {
        return cur?.map((category) =>
          category._id === _id ? updatedCategory : category
        )
      })
    },
    [_id, mutateCategories, mutateExercises]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCategory(id)
      setUrlCategory(null)
      mutateCategories((cur) => cur?.filter((category) => category._id !== id))
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
          id={_id}
          name={name}
          type="category"
          handleDelete={handleDelete}
          deleteDisabled={!!usage.length}
        />
      </Grid>
    </Grid>
  )
}
