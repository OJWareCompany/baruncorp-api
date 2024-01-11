// import { CommandBus } from '@nestjs/cqrs'
// import { Body, Param, Controller, Patch, UseGuards } from '@nestjs/common'
// import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
// // import { AuthGuard } from '../../../auth/authentication.guard'
// import { UserEntity } from '../../../users/domain/user.entity'
// import { UpdateFilesystemCommand } from './update-filesystem.command'
// import { UpdateFilesystemRequestDto, UpdateFilesystemParamRequestDto } from './update-filesystem.request.dto'

// @Controller('filesystems')
// export class UpdateFilesystemHttpController {
//   constructor(private readonly commandBus: CommandBus) { }
//   @Patch(':filesystemId')
//   // @UseGuards(AuthGuard)
//   async patch(
//     @User() user: UserEntity,
//     @Param() param: UpdateFilesystemParamRequestDto,
//     @Body() request: UpdateFilesystemRequestDto,
//   ): Promise<void> {
//     const command = new UpdateFilesystemCommand({
//       filesystemId: param.filesystemId,
//       ...request,
//     })
//     await this.commandBus.execute(command)
//   }
// }
