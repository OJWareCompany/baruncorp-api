import { Injectable } from '@nestjs/common'
import { DepartmentModel, PositionModel } from './database/department.repository'
import { PositionResponseDto } from './dtos/position.response.dto'
import { Mapper } from './license.mapper'
import { PositionEntity, CreatePositionProps } from './domain/position.entity'

@Injectable()
export class PositionMapper implements Mapper<PositionEntity, PositionModel, PositionResponseDto> {
  toPersistence(entity: PositionEntity): PositionModel {
    const copy = entity.getProps()
    const record: PositionModel = {
      id: copy.id,
      name: copy.name,
      description: copy.description,
      departmentId: copy.departmentId,
      updatedAt: new Date(),
      createdAt: new Date(),
    }
    return record
  }

  // TODO: validation white list.. since type can't ensure the field in runtime
  toDomain(record: PositionModel, department: DepartmentModel): PositionEntity {
    const props: CreatePositionProps = {
      name: record?.name || null,
      departmentId: record?.departmentId || null,
      departmentName: department?.name || null,
      description: record?.description || null,
    }

    const entity = new PositionEntity({
      id: record?.id,
      props,
    })
    return entity
  }

  toResponse(entity: PositionEntity): PositionResponseDto {
    const props = entity?.getProps()
    if (!props) return undefined
    const response = new PositionResponseDto()
    response.id = props.id
    response.name = props.name
    response.description = props.description
    response.department = props.departmentName
    return response
  }
}
