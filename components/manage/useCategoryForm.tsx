import CategoryForm from 'components/CategoryForm'
import CategorySelector from 'components/form-fields/selectors/CategorySelector'
import ManageWelcomeCard from 'components/ManageWelcomeCard'
import { updateCategoryFields, useCategories } from 'lib/frontend/restService'
import Category from 'models/Category'
import { useQueryState } from 'next-usequerystate'
import { useEffect, useState } from 'react'

export default function useCategoryForm() {
  const [category, setCategory] = useState<Category | null>(null)
  const [urlCategory, setUrlCategory] = useQueryState('category')
  const { categories, mutate: mutateCategories } = useCategories()

  useEffect(() => {
    if (!!category || !categories || !urlCategory) return

    setCategory(
      categories.find((category) => category.name === urlCategory) ?? null
    )
  }, [categories, category, urlCategory])

  const handleCategoryUpdate = async (updates: Partial<Category>) => {
    if (!category) return

    const newCategory = { ...category, ...updates }
    setCategory(newCategory)
    setUrlCategory(newCategory.name, { scroll: false, shallow: true })

    await updateCategoryFields(category, updates)
    mutateCategories()
  }

  return {
    Selector: (
      <CategorySelector
        {...{
          category,
          handleChange: (category) => {
            setCategory(category)
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
      <CategoryForm {...{ category, handleUpdate: handleCategoryUpdate }} />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
