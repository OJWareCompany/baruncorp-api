import { initialize } from '../../../../libs/utils/constructor-initializer'
import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'

export class PutScheduleCommand {
  readonly userId: string
  readonly schedules: ScheduleDto[]
  constructor(props: PutScheduleCommand) {
    initialize(this, props)
  }
}
