// import { NotFoundException } from '@nestjs/common'
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
// import { Filesystems } from '@prisma/client'
// import { initialize } from '../../../../libs/utils/constructor-initializer'
// import { PrismaService } from '../../../database/prisma.service'

// export class FindFilesystemQuery {
//   readonly filesystemId: string
//   constructor(props: FindFilesystemQuery) {
//     initialize(this, props)
//   }
// }

// @QueryHandler(FindFilesystemQuery)
// export class FindFilesystemQueryHandler implements IQueryHandler {
//   constructor(private readonly prismaService: PrismaService) {}

//   async execute(query: FindFilesystemQuery): Promise<Filesystems> {
//     const result = await this.prismaService.filesystems.findUnique({ where: { id: query.filesystemId } })
//     if (!result) throw new NotFoundException()
//     return result
//   }
// }
