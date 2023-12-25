import { CommandBus } from '@nestjs/cqrs'
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { User } from '../../../../libs/decorators/requests/logged-in-user.decorator'
import { AuthGuard } from '../../../auth/guards/authentication.guard'
import { UserEntity } from '../../../users/domain/user.entity'
import { CancelOrderedServiceCommand } from './cancel-ordered-service.command'
import { CancelOrderedServiceParamRequestDto } from './cancel-ordered-service.request.dto'

@Controller('ordered-services/cancel')
export class CancelOrderedServiceHttpController {
  constructor(private readonly commandBus: CommandBus) {}
  @Patch(':orderedServiceId')
  @UseGuards(AuthGuard)
  async patch(@User() user: UserEntity, @Param() param: CancelOrderedServiceParamRequestDto): Promise<void> {
    const command = new CancelOrderedServiceCommand(param)
    await this.commandBus.execute(command)
  }
}
