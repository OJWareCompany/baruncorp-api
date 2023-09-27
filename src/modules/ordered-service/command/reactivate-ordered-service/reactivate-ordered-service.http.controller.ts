import { CommandBus } from '@nestjs/cqrs'
import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { ReactivateOrderedServiceCommand } from './reactivate-ordered-service.command'
import { ReactivateOrderedServiceParamRequestDto } from './reactivate-ordered-service.request.dto'

@Controller('ordered-services/reactivate')
export class ReactivateOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedServiceId')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: ReactivateOrderedServiceParamRequestDto): Promise<void> {
    const command = new ReactivateOrderedServiceCommand(param)
    await this.commandBus.execute(command)
  }
}
