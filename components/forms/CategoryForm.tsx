import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  useCategories,
  useCategoryDelete,
  useCategoryUpdate,
  useTanstackExercises,
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
  const updateCategory = useCategoryUpdate()
  const deleteCategory = useCategoryDelete()
  const { data } = useTanstackExercises()
  const usage = getUsage(data, 'categories', name)
  const [_, setUrlCategory] = useQueryState('category')

  const updateFields = useCallback(
    async (updates: Partial<Category>) => {
      updateCategory({ _id, name, updates })
    },
    [_id, name, updateCategory]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setUrlCategory(null)
      deleteCategory(id)
    },
    [deleteCategory, setUrlCategory]
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
