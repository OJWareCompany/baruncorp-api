import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'

export interface CreateScheduleProps {
  schedules: ScheduleDto[]
}

export type ScheduleProps = CreateScheduleProps
