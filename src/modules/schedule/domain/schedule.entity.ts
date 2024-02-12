import { v4 } from 'uuid'
import { AggregateRoot } from '../../../libs/ddd/aggregate-root.base'
import { CreateScheduleProps, ScheduleProps } from './schedule.type'
import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'
import { DuplicateScheduleException, EndLaterThanStartException } from '@modules/schedule/domain/schedule.error'
import { compareAsc, parse } from 'date-fns'

export class ScheduleEntity extends AggregateRoot<ScheduleProps> {
  protected _id: string

  static create(create: CreateScheduleProps) {
    const id = v4()
    const props: ScheduleProps = {
      ...create,
    }

    return new ScheduleEntity({ id, props })
  }

  public checkValidation(): void {
    // 임의의 날짜를 사용하여 시간 문자열을 Date 객체로 파싱
    const parseTime = (time: string) => parse(time, 'HH:mm:ss', new Date())
    // 스케줄을 시작 시간 기준으로 정렬
    const sortedSchedules: ScheduleDto[] = this.props.schedules.sort((a, b) =>
      compareAsc(parseTime(a.start), parseTime(b.start)),
    )
    // 시작 시간이 종료 시간보다 늦는 경우 확인
    if (sortedSchedules.some((schedule) => compareAsc(parseTime(schedule.start), parseTime(schedule.end)) === 1)) {
      throw new EndLaterThanStartException()
    }
    // 겹치는 스케줄 확인
    for (let i = 0; i < sortedSchedules.length - 1; i++) {
      const currentEnd: Date = parseTime(sortedSchedules[i].end)
      const nextStart: Date = parseTime(sortedSchedules[i + 1].start)
      // currentEnd가 더 큰 경우 1
      if (compareAsc(currentEnd, nextStart) === 1) {
        throw new DuplicateScheduleException()
      }
    }
  }

  public validate(): void {
    return
  }
}
