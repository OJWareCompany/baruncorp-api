// import { Injectable } from '@nestjs/common'
// // import { Filesystems } from '@prisma/client'
// import { PrismaService } from '../../database/prisma.service'
// import { FilesystemMapper } from '../filesystem.mapper'
// // import { FilesystemEntity } from '../domain//Users/leesangwon/Projects/baruncorp-api/src/modules/filesystem/database.entity'
// import { FilesystemRepositoryPort } from './filesystem.repository.port'

// @Injectable()
// export class FilesystemRepository implements FilesystemRepositoryPort {
//   constructor(private readonly prismaService: PrismaService, private readonly filesystemMapper: FilesystemMapper) { }

//   async insert(entity: FilesystemEntity): Promise<void> {
//     const record = this.filesystemMapper.toPersistence(entity)
//     await this.prismaService.filesystems.create({ data: record })
//   }

//   async update(entity: FilesystemEntity): Promise<void> {
//     const record = this.filesystemMapper.toPersistence(entity)
//     await this.prismaService.filesystems.update({ where: { id: entity.id }, data: record })
//   }

//   async delete(id: string): Promise<void> {
//     await this.prismaService.$executeRaw<Filesystems>`DELETE FROM filesystems WHERE id = ${id}`
//   }

//   async findOne(id: string): Promise<FilesystemEntity | null> {
//     const record = await this.prismaService.filesystems.findUnique({ where: { id } })
//     return record ? this.filesystemMapper.toDomain(record) : null
//   }
// }
