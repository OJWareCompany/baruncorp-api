// import { Controller, Get, Param } from '@nestjs/common'
// import { QueryBus } from '@nestjs/cqrs'
// import { Filesystems } from '@prisma/client'
// import { FilesystemResponseDto } from '../../dtos/filesystem.response.dto'
// import { FindFilesystemRequestDto } from './find-filesystem.request.dto'
// import { FindFilesystemQuery } from './find-filesystem.query-handler'

// @Controller('filesystems')
// export class FindFilesystemHttpController {
//   constructor(private readonly queryBus: QueryBus) { }

//   @Get(':filesystemId')
//   async get(@Param() request: FindFilesystemRequestDto): Promise<FilesystemResponseDto> {
//     const command = new FindFilesystemQuery(request)

//     const result: Filesystems = await this.queryBus.execute(command)

//     return new FilesystemResponseDto()
//   }
// }
