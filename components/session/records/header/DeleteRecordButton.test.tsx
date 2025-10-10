import { Swiper } from 'swiper/react'
import { expect, it, vi } from 'vitest'
import { deleteRecord } from '../../../../lib/backend/mongoService'
import { render, screen } from '../../../../lib/testUtils'
import DeleteRecordButton from './DeleteRecordButton'

it('deletes', async () => {
  const { user } = render(
    <Swiper>
      <DeleteRecordButton _id="test" />
    </Swiper>
  )

  await user.click(screen.getByLabelText('Delete record'))

  expect(vi.mocked(deleteRecord)).toHaveBeenCalled()
})
