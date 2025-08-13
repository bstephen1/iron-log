import { useQueryState } from 'nuqs'
import { useModifiers } from '../../lib/frontend/restService'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ModifierSelector from '../form-fields/selectors/ModifierSelector'
import ModifierForm from './ModifierForm'

export default function useModifierForm() {
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const { modifiers, mutate: mutateModifiers } = useModifiers()

  const modifier =
    modifiers?.find((modifier) => modifier.name === urlModifier) ?? null

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
    Form: modifier ? <ModifierForm {...{ modifier }} /> : <ManageWelcomeCard />,
  }
}
