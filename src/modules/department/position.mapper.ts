// import { Injectable } from '@nestjs/common'
// import { PositionResponseDto } from './dtos/position.response.dto'
// import { Mapper } from '@libs/ddd/mapper.interface'

// @Injectable()
// export class PositionMapper implements Mapper<PositionEntity, PositionModel, PositionResponseDto> {
//   toPersistence(entity: PositionEntity): PositionModel {
//     const copy = entity.getProps()
//     const record: PositionModel = {
//       id: copy.id,
//       name: copy.name,
//       description: copy.description,
//       updatedAt: new Date(),
//       createdAt: new Date(),
//       maxAssignedTasksLimit: copy.maxAssignedTasksLimit,
//     }
//     return record
//   }

//   // TODO: validation white list.. since type can't ensure the field in runtime
//   toDomain(record: PositionModel): PositionEntity {
//     const props: PositionProps = {
//       name: record.name,
//       description: record.description,
//       maxAssignedTasksLimit: record.maxAssignedTasksLimit,
//     }

//     const entity = new PositionEntity({
//       id: record?.id,
//       props,
//     })
//     return entity
//   }

//   toResponse(entity: PositionEntity): PositionResponseDto {
//     const props = entity.getProps()
//     const response = new PositionResponseDto()
//     response.id = props.id
//     response.name = props.name
//     response.description = props.description
//     return response
//   }
// }
