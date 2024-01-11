// import { Filesystems } from '@prisma/client'
// import { Injectable } from '@nestjs/common'
// import { Mapper } from '../../libs/ddd/mapper.interface'
// import { FilesystemResponseDto } from './dtos/filesystem.response.dto'
// import { FilesystemEntity } from './domain/filesystem.entity'

// class Fields implements Filesystems {

// }

// @Injectable()
// export class FilesystemMapper implements Mapper<FilesystemEntity, Filesystems, FilesystemResponseDto> {
//   toPersistence(entity: FilesystemEntity): Filesystems {
//     const props = entity.getProps()
//     const record: Filesystems = {
//       id: props.id,
//     }
//     return record
//   }

//   toDomain(record: Filesystems): FilesystemEntity {
//     const entity = new FilesystemEntity({
//       id: record.id,
//       props: {
//       },
//     })
//     return entity
//   }

//   toResponse(entity: FilesystemEntity): FilesystemResponseDto {
//     const props = entity.getProps()
//     const response = new FilesystemResponseDto({
//       id: props.id,
//     })
//     return response
//   }
// }
