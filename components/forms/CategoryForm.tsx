import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  deleteCategory,
  updateCategoryFields,
} from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import {
  useCategories,
  useDeleteMutation,
  useExercises,
  useUpdateMutation,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'

interface Props {
  category: Category
}
export default function CategoryForm({ category: { name, _id } }: Props) {
  const categories = useCategories()
  const { data } = useExercises()
  const usage = getUsage(data, 'categories', name)
  const [_, setUrlCategory] = useQueryState('category')
  const deleteCategoryMutate = useDeleteMutation({
    queryKey: [QUERY_KEYS.categories],
    deleteFn: deleteCategory,
  })
  const updateCategoryMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.categories],
    updateFn: updateCategoryFields,
    invalidates: [QUERY_KEYS.exercises],
  })

  const updateFields = useCallback(
    async (updates: Partial<Category>) => {
      updateCategoryMutate({ _id, updates })
    },
    [_id, updateCategoryMutate]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setUrlCategory(null)
      deleteCategoryMutate(id)
    },
    [deleteCategoryMutate, setUrlCategory]
  )

  return (
    <Grid container spacing={1} size={12}>
      <Grid size={12}>
        <NameField
          name={name}
          handleUpdate={updateFields}
          options={categories.names}
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
