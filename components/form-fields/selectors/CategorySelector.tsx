import { addCategory } from 'lib/frontend/restService'
import Category from 'models/Category'
import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import SelectorBase from './SelectorBase'

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
  ...props
}: Props) {
  return (
    <SelectorBase
      {...props}
      options={categories}
      mutateOptions={mutate}
      value={category}
      label="Category"
      placeholder="Select or Add New Category"
      Constructor={Category}
      addNewItem={addCategory}
    />
  )
}
