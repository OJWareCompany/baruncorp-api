// import { Controller, Get, Query } from '@nestjs/common'
// import { QueryBus } from '@nestjs/cqrs'
// import { Filesystems } from '@prisma/client'
// import { PaginatedQueryRequestDto } from '../../../../libs/api/paginated-query.request.dto'
// import { Paginated } from '../../../../libs/ddd/repository.port'
// import { FilesystemPaginatedResponseDto } from '../../dtos/filesystem.paginated.response.dto'
// import { FindFilesystemPaginatedRequestDto } from './find-filesystem.paginated.request.dto'
// import { FindFilesystemPaginatedQuery } from './find-filesystem.paginated.query-handler'

// @Controller('filesystems')
// export class FindFilesystemPaginatedHttpController {
//   constructor(private readonly queryBus: QueryBus) {}

//   @Get('')
//   async get(
//     @Query() request: FindFilesystemPaginatedRequestDto,
//     @Query() queryParams: PaginatedQueryRequestDto,
//   ): Promise<FilesystemPaginatedResponseDto> {
//     const command = new FindFilesystemPaginatedQuery({
//       ...request,
//       ...queryParams,
//     })

//     const result: Paginated<Filesystems> = await this.queryBus.execute(command)

//     return new FilesystemPaginatedResponseDto({
//       ...queryParams,
//       ...result,
//       items: result.items.map((item) => ({
//         id: item.id,
//       })),
//     })
//   }
// }
