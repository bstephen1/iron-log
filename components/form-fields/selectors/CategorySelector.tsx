import { type Dispatch, type SetStateAction } from 'react'
import {
  useCategories,
  useCategoryAdd,
} from '../../../lib/frontend/restService'
import {
  type Category,
  createCategory,
} from '../../../models/AsyncSelectorOption/Category'
import AsyncSelector from './AsyncSelector'

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
  const categories = useCategories()
  const addCategory = useCategoryAdd()
  return (
    <AsyncSelector
      handleChange={handleChange}
      options={categories.data}
      addNewItem={disableAddNew ? undefined : addCategory}
      value={category}
      label="Category"
      placeholder="Select or add new category"
      createOption={createCategory}
    />
  )
}
