import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { DeactivateUserCommand } from './deactivate-user.command'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { DeactivateUserRequestParamDto } from './deactivate-user.request.dto'
import { IdResponse } from '../../../../libs/api/id.response.dto'

@Controller('users')
export class DeactivateUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':userId/deactivate')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Param() requestParam: DeactivateUserRequestParamDto) {
    const command = new DeactivateUserCommand({ userId: requestParam.userId })
    const result = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
