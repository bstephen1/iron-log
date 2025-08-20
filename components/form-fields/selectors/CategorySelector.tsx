import { type Dispatch, type SetStateAction } from 'react'
import {
  type Category,
  createCategory,
} from '../../../models/AsyncSelectorOption/Category'
import AsyncSelector from './AsyncSelector'
import { addCategory } from '../../../lib/backend/mongoService'
import { useCategories } from '../../../lib/frontend/restService'

interface Props {
  category: Category | null
  handleChange: Dispatch<SetStateAction<Category | null>>
  disableAddNew?: boolean
}
export default function CategorySelector({
  category,
  disableAddNew,
  handleChange,
}: Props) {
  const { categories, mutate } = useCategories()
  return (
    <AsyncSelector
      handleChange={handleChange}
      options={categories}
      mutateOptions={disableAddNew ? undefined : mutate}
      value={category}
      label="Category"
      placeholder="Select or add new category"
      createOption={createCategory}
      addNewItem={addCategory}
    />
  )
}
