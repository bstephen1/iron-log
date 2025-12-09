import DeleteIcon from '@mui/icons-material/Delete'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { deleteRecord } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { useDeleteMutation } from '../../../../lib/frontend/restService'
import TooltipIconButton from '../../../TooltipIconButton'

interface Props {
  _id: string
}
export default function DeleteRecordButton({ _id }: Props) {
  const swiper = useSwiper()
  const date = useCurrentDate()
  const deleteRecordMutate = useDeleteMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    deleteFn: deleteRecord,
  })

  const handleDelete = async (id: string) => {
    deleteRecordMutate(id)

    swiper.update()
    swiper.slidePrev()
  }

  return (
    <TooltipIconButton
      title="Delete record"
      color="error"
      onClick={() => handleDelete(_id)}
    >
      <DeleteIcon />
    </TooltipIconButton>
  )
}
