import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ChangeUserRoleCommand } from './change-user-role.command'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { IdResponse } from '../../../../libs/api/id.response.dto'
import { ChangeUserRoleRequestDto, ChangeUserRoleRequestParamDto } from './change-user-role.request.dto'

@Controller('users')
export class ChangeUserRoleHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post(':userId/roles')
  @UseGuards(AuthGuard)
  async post(
    @User() user: UserEntity,
    @Param() requestParam: ChangeUserRoleRequestParamDto,
    @Body() request: ChangeUserRoleRequestDto,
  ): Promise<IdResponse> {
    const command = new ChangeUserRoleCommand({
      updatedByUserId: user.id,
      newRole: request.newRole,
      userId: requestParam.userId,
    })
    const result = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
