import { Positions } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { Mapper } from '../../libs/ddd/mapper.interface'
import { PositionResponseDto } from './dtos/position.response.dto'
import { PositionEntity } from './domain/position.entity'
import { LicenseTypeEnum } from '../license/dtos/license.response.dto'

class Fields implements Positions {
  license_type: string | null
  id: string
  name: string
  description: string | null
  updatedAt: Date
  createdAt: Date
  maxAssignedTasksLimit: number | null
}

@Injectable()
export class PositionMapper implements Mapper<PositionEntity, Positions, PositionResponseDto> {
  toPersistence(entity: PositionEntity): Positions {
    const props = entity.getProps()
    const record: Positions = {
      id: props.id,
      name: props.name,
      description: props.description || null,
      license_type: props.licenseType,
      maxAssignedTasksLimit: props.maxAssignedTasksLimit,
      updatedAt: props.updatedAt,
      createdAt: props.createdAt,
    }
    return record
  }

  toDomain(record: Positions): PositionEntity {
    const entity = new PositionEntity({
      id: record.id,
      props: {
        name: record.name,
        description: record.description,
        maxAssignedTasksLimit: record.maxAssignedTasksLimit,
        licenseType: record.license_type as LicenseTypeEnum | null,
      },
    })
    return entity
  }

  toResponse(entity: PositionEntity): PositionResponseDto {
    const props = entity.getProps()
    const response = new PositionResponseDto({
      id: props.id,
      name: props.name,
      description: props.description || null,
      maxAssignedTasksLimit: props.maxAssignedTasksLimit,
      licenseType: props.licenseType,
      tasks: [],
      workers: [],
    })
    return response
  }
}
