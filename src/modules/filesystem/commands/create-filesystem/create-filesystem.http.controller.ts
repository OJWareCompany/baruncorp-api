// import { CommandBus } from '@nestjs/cqrs'
// import { Body, Controller, Post, UseGuards } from '@nestjs/common'
// import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
// import { IdResponse } from '../../../../libs/api/id.response.dto'
// import { AggregateID } from '../../../../libs/ddd/entity.base'
// // import { AuthGuard } from '../../../auth/authentication.guard'
// import { UserEntity } from '../../../users/domain/user.entity'
// import { CreateFilesystemCommand } from './create-filesystem.command'
// import { CreateFilesystemRequestDto } from './create-filesystem.request.dto'

// @Controller('filesystems')
// export class CreateFilesystemHttpController {
//   constructor(private readonly commandBus: CommandBus) { }
//   @Post('')
//   // @UseGuards(AuthGuard)
//   async post(@User() user: UserEntity, @Body() request: CreateFilesystemRequestDto): Promise<IdResponse> {
//     const command = new CreateFilesystemCommand(request)
//     const result: AggregateID = await this.commandBus.execute(command)
//     return new IdResponse(result)
//   }
// }
