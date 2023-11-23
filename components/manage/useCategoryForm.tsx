import { useQueryState } from 'next-usequerystate'
import CategoryForm from '../../components/CategoryForm'
import CategorySelector from '../../components/form-fields/selectors/CategorySelector'
import ManageWelcomeCard from '../../components/ManageWelcomeCard'
import {
  updateCategoryFields,
  useCategories,
  useExercises,
} from '../../lib/frontend/restService'
import Category from '../../models/AsyncSelectorOption/Category'

export default function useCategoryForm() {
  const [urlCategory, setUrlCategory] = useQueryState('category')
  const { categories, mutate: mutateCategories } = useCategories()
  const { mutate: mutateExercises } = useExercises()

  const category =
    categories?.find((category) => category.name === urlCategory) ?? null

  const handleUpdate = async (updates: Partial<Category>) => {
    if (!category) return

    const newCategory = { ...category, ...updates }
    // only has an effect if name has changed
    setUrlCategory(newCategory.name, { scroll: false, shallow: true })

    mutateCategories(
      async () => {
        const updatedCategory = await updateCategoryFields(category, updates)
        updates.name && mutateExercises()
        // still need to return the new categories, so have to build them
        return categories?.map((category) =>
          category._id === updatedCategory._id ? updatedCategory : category
        )
      },
      {
        // add the new category instead of overwriting existing one to avoid urlCategory
        // updating out of sync and not finding the new category.
        // Note that until the mutate resolves, both new and old categories will exist.
        // Also note we only need this optimistic data if the name has changed
        optimisticData: updates.name
          ? [...(categories ?? []), newCategory]
          : undefined,
      }
    )
  }

  return {
    Selector: (
      <CategorySelector
        {...{
          category,
          handleChange: (category) => {
            setUrlCategory(category?.name ?? null, {
              scroll: false,
              shallow: true,
            })
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
