import { type Dispatch, type SetStateAction } from 'react'
import { type KeyedMutator } from 'swr'
import {
  type Category,
  createCategory,
} from '../../../models/AsyncSelectorOption/Category'
import AsyncSelector from './AsyncSelector'
import { addCategory } from '../../../lib/backend/mongoService'

interface Props {
  categories?: Category[]
  category: Category | null
  mutate: KeyedMutator<Category[]>
  handleChange: Dispatch<SetStateAction<Category | null>>
}
export default function CategorySelector({
  categories,
  category,
  mutate,
  ...asyncSelectorProps
}: Props) {
  return (
    <AsyncSelector
      {...asyncSelectorProps}
      options={categories}
      mutateOptions={mutate}
      value={category}
      label="Category"
      placeholder="Select or add new category"
      createOption={createCategory}
      addNewItem={addCategory}
    />
  )
}
