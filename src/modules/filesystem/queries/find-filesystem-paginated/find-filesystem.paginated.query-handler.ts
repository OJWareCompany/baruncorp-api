// import { NotFoundException } from '@nestjs/common'
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
// import { Filesystems } from '@prisma/client'
// import { initialize } from '../../../../libs/utils/constructor-initializer'
// import { Paginated } from '../../../../libs/ddd/repository.port'
// import { PaginatedParams, PaginatedQueryBase } from '../../../../libs/ddd/query.base'
// import { PrismaService } from '../../../database/prisma.service'

// export class FindFilesystemPaginatedQuery extends PaginatedQueryBase {
//   readonly filesystemId: string
//   constructor(props: PaginatedParams<FindFilesystemPaginatedQuery>) {
//     super(props)
//     initialize(this, props)
//   }
// }

// @QueryHandler(FindFilesystemPaginatedQuery)
// export class FindFilesystemPaginatedQueryHandler implements IQueryHandler {
//   constructor(private readonly prismaService: PrismaService) {}

//   async execute(query: FindFilesystemPaginatedQuery): Promise<Paginated<Filesystems>> {
//     const result = await this.prismaService.filesystems.findMany({
//       skip: query.offset,
//       take: query.limit,
//     })
//     if (!result) throw new NotFoundException()
//     const totalCount = await this.prismaService.filesystems.count()
//     return new Paginated({
//       page: query.page,
//       pageSize: query.limit,
//       totalCount: totalCount,
//       items: result,
//     })
//   }
// }
