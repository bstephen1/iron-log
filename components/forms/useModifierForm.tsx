import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { useExercises, useModifiers } from '../../lib/frontend/restService'
import { type Modifier } from '../../models/AsyncSelectorOption/Modifier'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ModifierSelector from '../form-fields/selectors/ModifierSelector'
import ModifierForm from './ModifierForm'
import { updateModifierFields } from '../../lib/backend/mongoService'

export default function useModifierForm() {
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { mutate: mutateExercises } = useExercises()

  const modifier =
    modifiers?.find((modifier) => modifier.name === urlModifier) ?? null

  const handleUpdate = useCallback(
    async (id: string, updates: Partial<Modifier>) => {
      const updatedModifier = await updateModifierFields(id, updates)
      // setQueryState will rerender the entire page if setting to the same value
      if (updates.name) {
        setUrlModifier(updates.name)
        mutateExercises()
      }

      mutateModifiers(async (cur) => {
        return cur?.map((modifier) =>
          modifier._id === id ? updatedModifier : modifier
        )
      })
    },
    [mutateExercises, mutateModifiers, setUrlModifier]
  )

  return {
    Selector: (
      <ModifierSelector
        {...{
          modifier,
          handleChange: (modifier) => {
            setUrlModifier(modifier?.name ?? null)
          },
          modifiers,
          mutate: mutateModifiers,
        }}
      />
    ),
    Form: modifier ? (
      <ModifierForm {...{ modifier, handleUpdate }} />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
