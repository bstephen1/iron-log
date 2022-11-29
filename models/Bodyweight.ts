import dayjs from 'dayjs'

export class Bodyweight {
  constructor(
    public value: number,
    public clothes?: number,
    public date = dayjs()
  ) {}
}
