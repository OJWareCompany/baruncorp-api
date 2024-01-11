// import { CommandBus } from '@nestjs/cqrs'
// import { Body, Param, Controller, Delete, UseGuards } from '@nestjs/common'
// import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
// // import { AuthGuard } from '../../../auth/authentication.guard'
// import { UserEntity } from '../../../users/domain/user.entity'
// import { DeleteFilesystemCommand } from './delete-filesystem.command'
// import { DeleteFilesystemRequestDto, DeleteFilesystemParamRequestDto } from './delete-filesystem.request.dto'

// @Controller('filesystems')
// export class DeleteFilesystemHttpController {
//   constructor(private readonly commandBus: CommandBus) { }
//   @Delete(':filesystemId')
//   // @UseGuards(AuthGuard)
//   async delete(
//     @User() user: UserEntity,
//     @Param() param: DeleteFilesystemParamRequestDto,
//     @Body() request: DeleteFilesystemRequestDto,
//   ): Promise<void> {
//     const command = new DeleteFilesystemCommand({
//       filesystemId: param.filesystemId,
//       ...request,
//     })
//     await this.commandBus.execute(command)
//   }
// }
