import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { updateCategoryFields } from '../../lib/backend/mongoService'
import { useCategories, useExercises } from '../../lib/frontend/restService'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import ManageWelcomeCard from '../ManageWelcomeCard'
import CategorySelector from '../form-fields/selectors/CategorySelector'
import CategoryForm from './CategoryForm'

export default function useCategoryForm() {
  const [urlCategory, setUrlCategory] = useQueryState('category')
  const { categories, mutate: mutateCategories } = useCategories()
  const { mutate: mutateExercises } = useExercises()

  const category =
    categories?.find((category) => category.name === urlCategory) ?? null

  const handleUpdate = useCallback(
    async (id: string, updates: Partial<Category>) => {
      const updatedCategory = await updateCategoryFields(id, updates)
      // setQueryState will rerender the entire page if setting to the same value
      if (updates.name) {
        setUrlCategory(updates.name)
        mutateExercises()
      }

      mutateCategories(async (cur) => {
        return cur?.map((category) =>
          category._id === id ? updatedCategory : category
        )
      })
    },
    [mutateCategories, mutateExercises, setUrlCategory]
  )

  return {
    Selector: (
      <CategorySelector
        {...{
          category,
          handleChange: (category) => {
            setUrlCategory(category?.name ?? null)
          },
          categories,
          mutate: mutateCategories,
        }}
      />
    ),
    Form: category ? (
      <CategoryForm {...{ category, handleUpdate }} />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
