import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { InformationResponseDto } from './dtos/information.response.dto'
import { ScheduleModel, ScheduleQueryModel } from './database/schedule.repository'
import { ScheduleEntity } from './domain/schedule.entity'
import { ScheduleDto } from '@modules/schedule/commands/update-information/put-schedule.request.dto'

@Injectable()
export class ScheduleMapper implements Mapper<ScheduleEntity, ScheduleModel, InformationResponseDto> {
  toPersistence(entity: ScheduleEntity): ScheduleModel {
    const props = entity.getProps()

    const record: ScheduleModel = {
      id: props.id,
      schedules: JSON.parse(JSON.stringify(props.schedules)),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
    return record
  }

  toDomain(record: ScheduleQueryModel): ScheduleEntity {
    const entity: ScheduleEntity = new ScheduleEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        schedules: (record.schedules as unknown as ScheduleDto[]) ?? [],
      },
    })
    return entity
  }

  toResponse(entity: ScheduleEntity): any {
    return
  }
}
