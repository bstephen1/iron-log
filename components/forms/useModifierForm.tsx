import { useQueryState } from 'next-usequerystate'
import {
  updateModifierFields,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import Modifier from '../../models/AsyncSelectorOption/Modifier'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ModifierSelector from '../form-fields/selectors/ModifierSelector'
import ModifierForm from './ModifierForm'
import { useCallback } from 'react'

export default function useModifierForm() {
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { mutate: mutateExercises } = useExercises()

  const modifier =
    modifiers?.find((modifier) => modifier.name === urlModifier) ?? null

  const handleUpdate = useCallback(
    async (id: string, updates: Partial<Modifier>) => {
      // setQueryState will rerender the entire page if setting to the same value
      if (updates.name) {
        setUrlModifier(updates.name)
      }

      mutateModifiers(
        async (cur) => {
          const oldModifier = cur?.find((m) => m._id === id)
          if (!oldModifier) {
            return cur
          }

          const updatedModifier = await updateModifierFields(
            oldModifier,
            updates,
          )
          updates.name && mutateExercises()
          return cur?.map((modifier) =>
            modifier._id === updatedModifier._id ? updatedModifier : modifier,
          )
        },
        {
          optimisticData: (cur) => {
            if (!cur) return []

            const oldModifier = cur.find((m) => m._id === id)
            if (!oldModifier) {
              return cur
            }

            return cur.map((m) =>
              m._id === oldModifier._id ? { ...oldModifier, ...updates } : m,
            )
          },
        },
      )
    },
    [mutateExercises, mutateModifiers, setUrlModifier],
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
