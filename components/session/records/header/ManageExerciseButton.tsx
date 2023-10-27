import SettingsIcon from '@mui/icons-material/Settings'
import TooltipIconButton from 'components/TooltipIconButton'
import { useRouter } from 'next/router'
import useCurrentRecord from '../useCurrentRecord'

export default function ManageExerciseButton() {
  const router = useRouter()
  const { exercise } = useCurrentRecord()
  //  todo: use nextjs prefetch when record is active: https://nextjs.org/docs/api-reference/next/router#routerprefetch  }

  return (
    <TooltipIconButton
      key="manage"
      title="Manage Exercise"
      disabled={!exercise}
      onClick={() => router.push(`/manage?exercise=${exercise?.name}`)}
    >
      <SettingsIcon />
    </TooltipIconButton>
  )
}
