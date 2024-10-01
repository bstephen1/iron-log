import { useQueryState } from 'next-usequerystate'
import {
  updateCategoryFields,
  useCategories,
  useExercises,
} from '../../lib/frontend/restService'
import Category from '../../models/AsyncSelectorOption/Category'
import ManageWelcomeCard from '../ManageWelcomeCard'
import CategorySelector from '../form-fields/selectors/CategorySelector'
import CategoryForm from './CategoryForm'
import { useCallback } from 'react'

export default function useCategoryForm() {
  const [urlCategory, setUrlCategory] = useQueryState('category')
  const { categories, mutate: mutateCategories } = useCategories()
  const { mutate: mutateExercises } = useExercises()

  const category =
    categories?.find((category) => category.name === urlCategory) ?? null

  const handleUpdate = useCallback(
    async (id: string, updates: Partial<Category>) => {
      // setQueryState will rerender the entire page if setting to the same value
      if (updates.name) {
        setUrlCategory(updates.name)
      }

      mutateCategories(
        async (cur) => {
          const oldCategory = cur?.find((c) => c._id === id)
          if (!oldCategory) {
            return cur
          }

          const updatedCategory = await updateCategoryFields(
            oldCategory,
            updates,
          )
          updates.name && mutateExercises()
          // still need to return the new categories, so have to build them
          return cur?.map((category) =>
            category._id === updatedCategory._id ? updatedCategory : category,
          )
        },
        {
          optimisticData: (cur) => {
            if (!cur) return []

            const oldCategory = cur.find((m) => m._id === id)
            if (!oldCategory) {
              return cur
            }

            return cur.map((c) =>
              c._id === oldCategory._id ? { ...oldCategory, ...updates } : c,
            )
          },
        },
      )
    },
    [mutateCategories, mutateExercises, setUrlCategory],
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
