import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ReactivateUserCommand } from './reactivate-user.command'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { UserEntity } from '../../domain/user.entity'
import { ReactivateUserRequestParamDto } from './reactivate-user.request.dto'
import { IdResponse } from '../../../../libs/api/id.response.dto'

@Controller('users')
export class ReactivateUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':userId/activate')
  @UseGuards(AuthGuard)
  async post(@User() user: UserEntity, @Param() requestParam: ReactivateUserRequestParamDto) {
    const command = new ReactivateUserCommand({ userId: requestParam.userId })
    const result = await this.commandBus.execute(command)
    return new IdResponse(result)
  }
}
