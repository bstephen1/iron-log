import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  deleteCategory,
  updateCategoryFields,
} from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import {
  useDeleteMutation,
  useUpdateMutation,
} from '../../lib/frontend/data/useMutation'
import {
  useCategoryNames,
  useExercises,
} from '../../lib/frontend/data/useQuery'
import { getUsage } from '../../lib/frontend/usage'
import type { Category } from '../../models/AsyncSelectorOption/Category'
import ActionItems from '../form-fields/actions/ActionItems'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'

interface Props {
  category: Category
}
export default function CategoryForm({ category: { name, _id } }: Props) {
  const categoryNames = useCategoryNames()
  const exercises = useExercises()
  const usage = getUsage(exercises, 'categories', name)
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
      deleteCategoryMutate(id)
      await setUrlCategory(null)
    },
    [deleteCategoryMutate, setUrlCategory]
  )

  return (
    <Grid container spacing={1} size={12}>
      <Grid size={12}>
        <NameField
          name={name}
          handleUpdate={updateFields}
          existingNames={categoryNames}
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
